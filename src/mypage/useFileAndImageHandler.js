import { useState, useRef, useCallback,useEffect } from "react";
import axios from "axios";

const useFileAndImageHandler = (setFormData,userData) => {
  
  if (typeof setFormData !== "function") {
    throw new Error("setFormData는 반드시 함수여야 합니다.");
  }

    // 초기 이미지 설정
  const [imagePreview, setImagePreview] = useState(
    userData?.img ? `http://localhost:9000${userData.img}` : "/ProfileImg/anonymous.jpg"
  );

   useEffect(() => {
    if (userData?.img) {
      setImagePreview(`http://localhost:9000${userData.img}`);
    } else {
      setImagePreview("/ProfileImg/anonymous.jpg");
    }
  }, [userData]);
  
  const fileInputRef = useRef(null);

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImagePreview = useCallback((file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        handleImagePreview(file);
        handleImageUpload(file);
      }
    },
    [handleImagePreview]
  );

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:9000/user/mypage/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );

      if (response.data === "파일 업로드 성공") {
        setFormData((prev) => ({
          ...prev,
          profileImage: `/upload/profile/${file.name}`,
        }));
      } else {
        console.error("이미지 업로드 실패:", response.data);
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
    }
  }, [setFormData]);

  

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleImagePreview(file);
        handleImageUpload(file);
      }
    },
    [handleImagePreview, handleImageUpload]
  );

  const handleDragOver = useCallback((e) => e.preventDefault(), []);

  const handleCancelImage = () => {
    setImagePreview(userData?.img ? `http://localhost:9000${userData.img}` : "/ProfileImg/anonymous.jpg");
  };

  const handleResetToDefaultImage = () => {
    const defaultImage = "/ProfileImg/anonymous.jpg";
  setImagePreview(defaultImage);
  setFormData((prev) => ({
    ...prev,
    profileImage: defaultImage, // 기본 이미지 경로 설정
  }));
};

  return {
    imagePreview,
    setImagePreview,
    fileInputRef,
    handleFileInputClick,
    handleDrop,
    handleFileChange,
    handleDragOver,
    handleCancelImage,
    handleResetToDefaultImage,
  };
};

export default useFileAndImageHandler;