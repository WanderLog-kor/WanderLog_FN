import React, { useState, useEffect } from "react";
import axios from "axios";
import useMyPage from "./useMyPage"; // Custom hook import
import useProfileImage from "./useProfileImage";
import "./MyInformation.scss";
import { useLoginStatus } from "../auth/PrivateRoute";
import Header from "../components/Header";
import Edit from "../images/edit.png";
import Setting from "../images/settings.png";
import { previousMonday } from "date-fns";

const MyInformation = ({detailProfile,setDetailProfile}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const { loginData, loginStatus } = useLoginStatus();
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [originUsername , setOriginUsername] = useState(userData?.username || "");
  console.log(loginData);

  // 비밀번호 필드 활성화 상태 추가
  // const [detailProfile, setDetailProfile] = useState(false); //상세정보 보기 상태변수
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true); //
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false); // 
    setValidationMessages({});
    setFormData((prev) => ({ ...prev, nowPassword: "", password: "", repassword: "" })); 
  };

  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false); // 비밀번호 유효성 여부

  const [formData, setFormData] = useState({
    profileImage: "/ProfileImg/anonymous.jpg",
    userid: "",
    username: "",
    email: "",
    // gender: "",
  });
  const {
    setValidationMessages,
    validationMessages,
    authCodeSent,
    timer,
    isAuthCodeLocked,
    validatePassword,
    handlePasswordEditClick,
    handleCancelPasswordEditing,
    validateEmail,
    isPasswordEditing,
    setIsPasswordEditing,
    handleChange,
    sendAuthCode,
    verifyAuthCode,
    resetAuthState,
  } = useMyPage(formData, setFormData);

  const {
    imagePreview,
    fileInputRef,
    handleFileInputClick,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleCancelImage,
    handleResetToDefaultImage,
    setImagePreview,
  } = useProfileImage(formData, setFormData,setIsSaveEnabled,userData); // 함수 자체로 전달

  useEffect(()=> {
    if(userData?.username){
      setOriginUsername(userData.username);
    }
  },[userData?.username]);

  // Fetch user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // 쿠키 유효성 확인   //필요없음
        // await axios.post(
        //   "http://localhost:9000/api/cookie/validate",
        //   {},
        //   {
        //     withCredentials: true,
        //   }
        // );

        // 사용자 데이터 가져오기
        const userResponse = await axios.get(
          "http://localhost:9000/user/mypage",
          {
            withCredentials: true,
          }
        );

        setUserData(userResponse.data);
        setFormData({
          profileImage: userResponse.data.img || "/ProfileImg/anonymous.jpg",
          userid: userResponse.data.userid,
          username: userResponse.data.username,
          email: userResponse.data.email,
          birth: userResponse.data.birth,
          password: "",
          nowPassword: userResponse.data.password,
          // gender: userResponse.data.gender,
        });
        setLoading(false);
        console.log("현재 유저 정보",userResponse.data);
      } catch (err) {
        console.error("오류:", err);
        setError("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // userData 제거 // 의존성 배열에서 `userData`를 제외하여 무한 루프 방지

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  // 수정 버튼 클릭 시 현재 프로필 이미지를 미리보기로 설정
  const handleEditClick = () => {
    if (userData) {
      setImagePreview(
        userData.img
          ? `http://localhost:9000${userData.img}`
          : "/ProfileImg/anonymous.jpg"
      );
      setFormData({
        profileImage: userData.img || "/ProfileImg/anonymous.jpg",
        userid: userData.userid,
        username: userData.username,
        email: userData.email,
      });
    }
    setIsEditing(true); // 수정 모드 활성화
  };

  const handleCancelChanges = () => {
    setFormData({
      profileImage: userData.img || "/ProfileImg/anonymous.jpg",
      userid: userData.userid,
      username: userData.username,
      email: userData.email,
      password: "",
      repassword: "",
    });
    setIsEditing(false);
  };

  const handleCancelEmailEditing = () => {
    setIsEmailEditing(false);
    setFormData((prev) => ({
      ...prev,
      email: userData.email,
    }));
    resetAuthState();
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      email: value,
    }));

    // 이메일 입력 시 상태 초기화
    resetAuthState();
    setValidationMessages((prev) => ({
      ...prev,
      email: "",
      authCode: "",
    }));
  };
  console.log("유저데이터",userData);

  const handlePasswordChange = async (e) => {
    const { name, value } = e.target;

    // 비밀번호 변경
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("현재 입력한 값:", value);
    console.log("userData.password:", userData.password);

    // 비밀번호 유효성 검사 호출
    if (name === "nowPassword") {
      try{
        const response = await axios.post(
          "http://localhost:9000/user/mypage/check-password",
          {password : value},
          {withCredentials: true}
        );

        setValidationMessages((prev) =>({
          ...prev,
          nowPassword: "현재 비밀번호가 확인되었습니다",
          nowPasswordColor: "validation-success",
        }));
      }catch (error) {
        setValidationMessages((prev) =>({
          ...prev,
          nowPassword: "현재 비밀번호가 올바르지 않습니다.",
          nowPasswordColor: "validation-error",
        }));
      }
    }

    // 비밀번호 확인 로직
    if (name === "password") {
      const validationResult = validatePassword(value);
      setValidationMessages((prev)=>({
        ...prev,
        password:validationResult.message,
        passwordColor: validationResult.color,
      }));
    }

    if (name === "repassword") {
      if(formData.password !== value){
        setValidationMessages((prev)=>({
          ...prev,
          repassword : "비밀번호 확인이 일치하지 않습니다",
          repasswordColor: "validation-error",
        }));
        setIsPasswordValid(false);
      }else {
        setValidationMessages((prev) => ({
          ...prev,
          repassword: "비밀번호가 일치합니다.",
          repasswordColor: "validation-success",
        }));
        setIsPasswordValid(true);
      }
    }
  };
  

  const handleSaveChanges = async () => {

    try {
      if(formData.password || formData.reapssword){
        const passwordCheckResponse = await axios.post(
          "http://localhost:9000/user/mypage/check-password",
          { password: formData.nowPassword },
          { withCredentials: true }
        );
  
        if(passwordCheckResponse.data !== "비밀번호가 일치합니다"){
          alert("현재 비밀번호가 일치하지 않습니다.");
         return;
        }
  
      if (!formData.password || !formData.repassword) {
        alert("새 비밀번호를 입력해주세요!");
        return;
      }
      if (formData.password !== formData.repassword) {
        alert("비밀번호 확인이 일치하지 않습니다.");
        return;
      }
  
      // 비밀번호, 사용자 이름, 이메일 확인
      const passwordValidationResult = validatePassword(formData.password);
      if(passwordValidationResult.color === "validation-error"){
        alert(passwordValidationResult.message);
        return ;
        }
      }

    const updateData = {};
    if(formData.username) updateData.username = formData.username;
    if(formData.profileImage) updateData.profileImage = formData.profileImage;
    if(formData.password && formData.repassword) {
      updateData.password = formData.password;
      updateData.repassword = formData.repassword;
    }

      // 사용자 정보 업데이트
      await axios.put(
        "http://localhost:9000/user/mypage/userupdate",updateData,        
        { withCredentials: true }
      );
      console.log("유저 정보가 성공적으로 변경되었습니다.");
      alert("유저 정보가 성공적으로 변경되었습니다.");
      window.location.reload();
      setFormData((prev) => ({ ...prev, nowPassword:"", password: "", repassword: "" }));
      setIsPasswordEditing(false);
      // setIsPasswordValidationVisible(false);
      setValidationMessages({});
      setIsPasswordModalOpen(false);
      setDetailProfile(false);
    } catch (err) {
      console.error("유저 정보 변경 중 오류:", err);
      alert("서버 오류로 비밀번호를 변경할 수 없습니다.");
      // setValidationMessages((prev) => ({
      //   ...prev,
      //   username: "서버 오류로 유저 정보를 변경할 수 없습니다.",
      //   usernameColor: "validation-error",
      // }));
    }
  };

  // 사용자 이름 유효성 검사 (영어, 한글만 허용)
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z가-힣]{2,15}$/u; // 영어, 한글만 허용
    if (!usernameRegex.test(username)) {
      setValidationMessages((prev) => ({
        ...prev,
        username: "이름은 영어 및 완성된 한글만 사용할 수 있으며, 2~20자여야 합니다.",
        usernameColor: "validation-error",
      }));
      return false;
    } else {
      setValidationMessages((prev) => ({
        ...prev,
        username: "",
        usernameColor: "validation-success",
      }));
      return true;
    }
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, username: value }));

    // 사용자 이름 유효성 검사
    const isValid = validateUsername(value);

    if(isValid && value !== originUsername){
      setIsSaveEnabled(true);
    }else{
      setIsSaveEnabled(false);
    }
  };

  const handleEmailValidation = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, email: value }));

    // 이메일 유효성 검사
    validateEmail(value);
  };

  const handleDelet = async () => {
    if (!window.confirm("정말로 회원탈퇴를 하시겠습니까?")) {
      return;
    }

    try {
      const response = await axios.delete(
        "http://localhost:9000/user/mypage/delete",
        {
          withCredentials: true, // 쿠키 인증 정보를 함께 보냄
        }
      );

      if (response.status === 200) {
        alert("회원탈퇴가 완료되었습니다.");
        // 로그아웃 처리 및 리다이렉트
        setUserData(null); // 유저 데이터를 초기화
        window.location.href = "/"; // 홈 페이지로 리다이렉트
      }
    } catch (error) {
      console.error("회원탈퇴 중 오류 발생:", error);
      alert("회원탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleProfileButton = () => {
    if (detailProfile) {
    }
  };

  return (
    <div className="mypage-container">
      {!detailProfile ? (
        <div className="basic-profile">
          <div className="profile-header">
            <Header> </Header>
            <img
              src={
                imagePreview ||
                (userData.img
                  ? `http://localhost:9000${userData.img}`
                  : "/ProfileImg/anonymous.jpg")
              }
              alt="프로필 사진"
              className="profile-img"
            />
          </div>
          <div className="profile-body">
                      
          <h2>{userData.username}</h2>
          <button
            onClick={() => {
              setDetailProfile(true);
            }}
            className="detailProfile-button"
          >
            프로필 관리
            <img src={Setting} alt="세팅" className="setting-image"/>
          </button>
          </div>
        </div>
      ) : (
        //상세 정보 보기
        <div className="detail-profile">
          <div className="profile-header">
            <Header> </Header>
            <img
              src={
                imagePreview ||
                (userData.img
                  ? `http://localhost:9000${userData.img}`
                  : "/ProfileImg/anonymous.jpg")
              }
              alt="프로필 사진"
              className="profile-img"
            />
            <button onClick={()=> fileInputRef.current?.click()} className="editButton">
              <img src={Edit} alt="수정" />
            </button>
            <input 
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{display : "none"}}
            onChange={handleFileChange}
            />
            <h2 className="detail-username">{userData.username}</h2>
          </div>

          <div className="detail-userInfo">
            <h2>프로필 설정</h2>
            <div className="detail-input mb-3">
              <label className="d-block mb-2 detail-input_label">이메일</label>
              <input
                type="text"
                className="form-control mb-3"
                placeholder={userData.email}
                aria-label="이메일"
                disabled
              />

              <label className="d-block mb-2 detail-input_label">닉네임</label>
              <input
                type="text"
                className="form-control mb-3"
                aria-label="닉네임"
                aria-describedby="basic-addon2"
                value={formData.username}
                onChange={handleUsernameChange}
                defaultValue={userData.username}
              />
              {validationMessages.username && (
                <div className={`validation-message ${validationMessages.usernameColor}`}>
                  {validationMessages.username}
                </div>
              )}

              <label className="d-block mb-2 detail-input_label">
                생년월일
              </label>
              <input
                type="text"
                className="form-control mb-3"
                aria-label="생년월일"
                aria-describedby="basic-addon2"
                defaultValue={userData.birth}
                disabled
              />

              <div className="detail-password">
                <label className="d-block mb-2 detail-input_label">
                  비밀번호
                </label>
                <input
                  type="password"
                  className="form-control mb-3"
                  aria-label="비밀번호"
                  aria-describedby="basic-addon2"
                  value="********"
                  disabled
                />
                <button
                  className="btn btn-secondary btn-sm pweditButton"
                  onClick={handleOpenPasswordModal}
                >
                  비밀번호 변경
                </button>

                {isPasswordModalOpen && (
                  <div className="password-modal">
                    <div className="modal-content">
                      <h2>비밀번호 변경</h2>
                      {/* Password Input */}
                      <input
                        type="password"
                        name="nowPassword"
                        placeholder="현재 비밀번호"
                        className="form-control mb-2"
                        onChange={handlePasswordChange}
                      />
                      {validationMessages.nowPassword && (
                        <div
                          className={`validation-message ${validationMessages.nowPasswordColor}`}
                        >
                          {validationMessages.nowPassword}
                        </div>
                      )}
                      <input
                        type="password"
                        name="password"
                        placeholder="새 비밀번호"
                        className="form-control mb-2"
                        onChange={handlePasswordChange}
                      />
                      {validationMessages.password && (
                        <div
                          className={`validation-message ${validationMessages.passwordColor}`}
                        >
                          {validationMessages.password}
                        </div>
                      )}
                      <input
                        type="password"
                        name="repassword"
                        placeholder="새 비밀번호 확인"
                        className="form-control"
                        onChange={handlePasswordChange}
                      />
                      {validationMessages.repassword && (
                        <div
                          className={`validation-message ${validationMessages.repasswordColor}`}
                        >
                          {validationMessages.repassword}
                        </div>
                      )}

                      <div className="modal-buttons">
                        <button
                          className="btn btn-secondary"
                          onClick={handleClosePasswordModal}
                        >
                          취소
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={handleSaveChanges}
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-buttons">
              <div className="backAndSaveBtn">
                <button
                  onClick={() => {
                    setDetailProfile(false); 
                  }}
                  className="btn btn-secondary"
                >
                  뒤로 가기
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="btn btn-primary"
                  disabled={!isSaveEnabled} //변경 사항이 있으면 활성화
                >
                  저장
                </button>
              </div>
              <div className="detail-userDelete my-3">
                <button
                  // onClick={}
                  className="delete-btn btn btn-danger"
                >
                  회원탈퇴
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInformation;
