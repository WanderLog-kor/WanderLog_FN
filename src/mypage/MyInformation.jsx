import React, { useState, useEffect } from "react";
import axios from "axios";
import useMyPage from "./useMyPage"; // Custom hook import
import useProfileImage from "./useProfileImage";
import "./MyInformation.scss"

const MyInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // 비밀번호 필드 활성화 상태 추가

  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false); // 비밀번호 유효성 여부

  const [formData, setFormData] = useState({
    profileImage: "/ProfileImg/anonymous.jpg",
    userid: "",
    username: "",
    email: "",
    gender: "",
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
  } = useProfileImage(formData, setFormData); // 함수 자체로 전달

  // Fetch user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // 쿠키 유효성 확인
        await axios.post(
          "http://localhost:9000/api/cookie/validate",
          {},
          {
            withCredentials: true,
          }
        );

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
          gender: userResponse.data.gender,
        });
        setLoading(false);
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    // 비밀번호 변경
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 비밀번호 유효성 검사 호출
    if (name === "password") {
      const validationResult = validatePassword(value);
      setValidationMessages((prev) => ({
        ...prev,
        password: validationResult.message,
        passwordColor: validationResult.color,
      }));
    }

    // 비밀번호 확인 로직
    if (name === "repassword") {
      if (formData.password !== value) {
        setValidationMessages((prev) => ({
          ...prev,
          repassword: "비밀번호 확인이 일치하지 않습니다.",
          repasswordColor: "validation-error",
        }));
        setIsPasswordValid(false);
      } else {
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
    // 비밀번호, 사용자 이름, 이메일 확인
    if (isPasswordEditing && !isPasswordValid) {
      alert("비밀번호 확인을 다시 확인해주세요.");
      return;
    }

    if (isEmailEditing && !isAuthCodeLocked) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!formData.username) {
      alert("이름을 입력해 주세요.");
      return;
    }

    // if (!formData.email || !isAuthCodeLocked) {
    //   alert("이메일 인증을 완료해주세요.");
    //   return;
    // }

    if (
      formData.username === userData.username &&
      formData.email === userData.email &&
      formData.profileImage === userData.img &&
      (!formData.password || formData.password === "")
    ) {
      alert("변경된 사항이 없습니다.");
      return;
    }

    try {
      // 사용자 정보 업데이트
      await axios.put(
        "http://localhost:9000/user/mypage/userupdate",
        {
          profileImg: formData.profileImage,
          username: formData.username,
          email: formData.email,
          password: formData.password, // 비밀번호도 함께 업데이트
        },
        { withCredentials: true }
      );
      console.log("유저 정보가 성공적으로 변경되었습니다.");
      alert("유저 정보가 성공적으로 변경되었습니다.");

      // 새로고침
      window.location.reload();
    } catch (err) {
      console.error("유저 정보 변경 중 오류:", err);
      setValidationMessages((prev) => ({
        ...prev,
        username: "서버 오류로 유저 정보를 변경할 수 없습니다.",
        usernameColor: "validation-error",
      }));
    }
  };

  // 사용자 이름 유효성 검사 (영어, 한글만 허용)
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z가-힣]+$/; // 영어, 한글만 허용
    if (!usernameRegex.test(username)) {
      setValidationMessages((prev) => ({
        ...prev,
        username: "이름은 영어 및 한글만 사용할 수 있습니다.",
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
    validateUsername(value);
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

  return (
    <div className="mypage-container">
      <h2>{userData.username}님의 마이페이지</h2>
      <div className="image-preview-container">
        {isEditing ? (
          <>
            {/* Profile Image */}
            <div
              className="image-preview-container"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <img
                src={imagePreview}
                alt="미리보기"
                className="circle-preview"
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            </div>
            <div id="imgbutton">
              <button type="button" onClick={handleFileInputClick}>
                이미지 업로드
              </button>
              <button type="button" onClick={handleCancelImage}>
                이미지 취소
              </button>
              <button type="button" onClick={handleResetToDefaultImage}>
                기본 이미지로 변경
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="이름"
              value={formData.username}
              onChange={handleUsernameChange}
            />
            {validationMessages.username && (
              <div
                className={`validation-message ${validationMessages.usernameColor}`}
              >
                {validationMessages.username}
              </div>
            )}

            {/* Email */}
            <div
              className={`emailbox ${
                validationMessages.email ? "has-message" : ""
              }`}
            >
              <div className="email-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="이메일 입력"
                  onChange={handleEmailChange}
                  disabled={!isEmailEditing}
                />
                {isEmailEditing ? (
                  <>
                    <button type="button" onClick={sendAuthCode}>
                      인증 코드 받기
                    </button>
                    <button type="button" onClick={handleCancelEmailEditing}>
                      취소
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setIsEmailEditing(true)}>
                    이메일 수정
                  </button>
                )}
              </div>
              {validationMessages.email && (
                <div
                  className={`validation-message ${validationMessages.emailColor}`}
                >
                  {validationMessages.email}
                </div>
              )}
            </div>

            {/* Auth Code */}
            {authCodeSent &&
              validationMessages.emailColor === "validation-success" && (
                <div className="auth-codebox">
                  <div className="auth-code-wrapper">
                    <input
                      type="text"
                      name="authCode"
                      placeholder="인증 코드 입력"
                      value={formData.authCode}
                      onChange={handleChange}
                      disabled={isAuthCodeLocked}
                    />
                    <div id="timer">
                      {Math.floor(timer / 60)}:
                      {String(timer % 60).padStart(2, "0")}
                    </div>
                    <button
                      type="button"
                      onClick={verifyAuthCode}
                      disabled={isAuthCodeLocked}
                    >
                      인증 코드 확인
                    </button>
                  </div>
                  {validationMessages.authCode && (
                    <div
                      className={`validation-message ${validationMessages.authCodeColor}`}
                    >
                      {validationMessages.authCode}
                    </div>
                  )}
                </div>
              )}

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handlePasswordChange}
              disabled={!isPasswordEditing}
            />
            {validationMessages.password && (
              <div
                className={`validation-message ${validationMessages.passwordColor}`}
              >
                {validationMessages.password}
              </div>
            )}

            {/* Confirm Password */}
            {isPasswordEditing && (
              <input
                type="password"
                name="repassword"
                value={formData.repassword}
                placeholder="비밀번호 확인"
                onChange={handlePasswordChange}
              />
            )}
            {isPasswordEditing && validationMessages.repassword && (
              <div
                className={`validation-message ${validationMessages.repasswordColor}`}
              >
                {validationMessages.repassword}
              </div>
            )}

            {/* Buttons */}
            <div>
              {!isPasswordEditing ? (
                <button type="button" onClick={handlePasswordEditClick}>
                  비밀번호 변경
                </button>
              ) : (
                <button type="button" onClick={handleCancelPasswordEditing}>
                  변경 취소
                </button>
              )}
            </div>

            <div>
              <button type="button" onClick={handleSaveChanges}>
                유저 정보 변경
              </button>
              <button type="button" onClick={handleCancelChanges}>
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <img
              src={
                userData.img
                  ? `http://localhost:9000${userData.img}`
                  : "/ProfileImg/anonymous.jpg"
              }
              alt="프로필 사진"
              className="profile-img"
            />
            <p>아이디: {userData.userid}</p>
            <p>이메일: {userData.email}</p>
            <p>성별 : {userData.gender}</p>
            <p>생년월일 : {userData.birth}</p>
            <button onClick={handleEditClick}>수정</button>
            <button type="button" onClick={handleDelet}>
              회원탈퇴
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyInformation;
