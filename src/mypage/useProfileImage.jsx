import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024; //이미지파일 크기제한용 5MB

const useProfileImage = (formData, setFormData,setIsSaveEnabled,userData) => {
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

  const handleImageUpload = async (file)=> {
      if (!file) return;

    if(file.size > MAX_FILE_SIZE){
      alert("파일 용량이 큽니다. 5MB 이하의 이미지를 선택해주세요.");
      return ;
    }
    console.log("핸들업로그함수");
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

          if(typeof setIsSaveEnabled === "function"){
            setIsSaveEnabled(true); console.log("저장버튼 활성화")
          }

        } else {
          console.error("이미지 업로드 실패:", response.data);
        }
      } catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error.message);
      }
    };

  const handleImagePreview = useCallback((file) => { console.log("핸들프리뷰함수");
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result); 
        if(typeof setIsSaveEnabled === "function"){
          setIsSaveEnabled(true);
        }};
      reader.readAsDataURL(file);
    }
  }, [setIsSaveEnabled]);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0]; 
      if (file) {
        console.log("핸들파일체인지",file);

        if(file.size > MAX_FILE_SIZE){
          alert("파일 용량이 큽니다. 5MB 이하의 이미지를 선택해주세요");
          return ;
        }
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
