import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024; //이미지파일 크기제한용 5MB

const useProfileImage = (formData, setFormData,setIsSaveEnabled,userData) => {
  if (typeof setFormData !== "function") {
    throw new Error("setFormData는 반드시 함수여야 합니다.");
  }

  const [imagePreview, setImagePreview] = useState(
    userData?.img ? `https://www.wanderlog.shop${userData.img}` : "/ProfileImg/anonymous.jpg"
  );

  useEffect(() => {
    if (userData?.img) {
      setImagePreview(`https://www.wanderlog.shop${userData.img}`);
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
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "https://www.wanderlog.shop/user/mypage/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        );


        if (response.data === "파일 업로드 성공") {
          setFormData((prev) => ({
            ...prev,
            profileImage: `/upload/profile/${file.name}`,
          }));

          if(typeof setIsSaveEnabled === "function"){
            setIsSaveEnabled(true);
          }

        } else {
        }
      } catch (error) {
      }
    };

  const handleImagePreview = useCallback((file) => { 
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
        "https://www.wanderlog.shop/user/mypage/set-default-image",
        { profileImage: defaultImage },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.status === 200) {
        setFormData((prev) => ({
          ...prev,
          profileImage: defaultImage,
        }));
      } else {
      }
    } catch (error) {
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
