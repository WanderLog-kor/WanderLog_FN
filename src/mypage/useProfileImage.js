import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";

const useProfileImage = (formData, setFormData, userData) => {
  if (typeof setFormData !== "function") {
    throw new Error("setFormData는 반드시 함수여야 합니다.");
  }

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

  const handleImageUpload = ()=> (
    async (file) => {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://localhost:9000/user/mypage/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        );

        console.log("이미지 업로드 응답:", response.data);

        if (response.data === "파일 업로드 성공") {
          setFormData((prev) => ({
            ...prev,
            profileImage: `/upload/profile/${file.name}`,
          }));
        } else {
          console.error("이미지 업로드 실패:", response.data);
        }
      } catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error.message);
      }
    },
    [setFormData]
  );

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
    [handleImagePreview, handleImageUpload]
  );

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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

  const handleCancelImage = useCallback(() => {
    const defaultImage = userData?.img
      ? `http://localhost:9000${userData.img}`
      : "/ProfileImg/anonymous.jpg";

    setImagePreview(defaultImage);
    setFormData((prev) => ({
      ...prev,
      profileImage: defaultImage,
    }));
  }, [userData, setFormData]);

  const handleResetToDefaultImage = useCallback(async () => {
    const defaultImage = "/ProfileImg/anonymous.jpg";
    setImagePreview(defaultImage);

    try {
      const response = await axios.post(
        "http://localhost:9000/user/mypage/set-default-image",
        { profileImage: defaultImage },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.status === 200) {
        setFormData((prev) => ({
          ...prev,
          profileImage: defaultImage,
        }));
        console.log("기본 이미지로 변경 성공");
      } else {
        console.error("기본 이미지로 변경 실패:", response.data);
      }
    } catch (error) {
      console.error("기본 이미지 변경 중 오류 발생:", error.message);
    }
  }, [setFormData]);

  return {
    imagePreview,
    fileInputRef,
    handleFileInputClick,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleCancelImage,
    handleResetToDefaultImage,
    setImagePreview,
  };
};

export default useProfileImage;
