import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './Join.scss'; // 스타일 파일
import signUpImg from './signup.png';
import { useCallback } from "react";
import HeaderLogo from '../components/logoImage/logo2.png'
const Join = () => {
    const [formData, setFormData] = useState({
        userid: "",
        username: "",
        password: "",
        repassword: "",
        email: "",
        birth: "",
        profileImage: "/ProfileImg/anonymous.jpg",
        authCode: "",
    });

    const [imagePreview, setImagePreview] = useState("/ProfileImg/anonymous.jpg"); // 기본 이미지
    const [validationMessages, setValidationMessages] = useState({});
    const [authCodeSent, setAuthCodeSent] = useState(false);
    const [timeSee, setTimeSee] = useState(false);
    const [timer, setTimer] = useState(180);
    const [isAuthCodeVerified, setIsAuthCodeVerified] = useState(false);
    const [isFirstSend, setIsFirstSend] = useState(true); // 초기 상태는 true
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const [formImgeData, setFormImgeData] = useState({
        profileImage: null, // 이미지 파일 상태
    });


    // 타이머
    useEffect(() => {
        let countdown;
        if (authCodeSent && timer > 0 && !isAuthCodeVerified) {
            countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(countdown);
    }, [authCodeSent, timer, isAuthCodeVerified]);



    const validatePasswords = useCallback(() => {
        if (formData.password && formData.repassword) {
            const isValid = formData.password === formData.repassword;
            const message = isValid ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.";
            const color = isValid ? "validation-success" : "validation-error";

            setValidationMessages((prevMessages) => ({
                ...prevMessages,
                repassword: message,
                repasswordColor: color, // 스타일 클래스 반영
            }));
        } else {
            setValidationMessages((prevMessages) => ({
                ...prevMessages,
                repassword: "",
                repasswordColor: "",
            }));
        }
    }, [formData.password, formData.repassword]);



    // 비밀번호 일치 검사를 useEffect로 실행
    useEffect(() => {
        validatePasswords();
    }, [validatePasswords]);


    // 실시간 입력 맞춤 검사(email & password)
    const validateBirth = (birth) => {
        const today = new Date();
        const regex = /^\d{8}$/;

        if (!regex.test(birth)) {
            return { message: "생년월일은 YYYYMMDD 형식의 숫자 8자리여야 합니다.", color: "validation-error" };
        }

        const year = parseInt(birth.substring(0, 4), 10);
        const month = parseInt(birth.substring(4, 6), 10);
        const day = parseInt(birth.substring(6, 8), 10);

        if (year < 1900 || year > today.getFullYear()) {
            return { message: "생년월일의 연도는 1900년 이후여야 합니다.", color: "validation-error" };
        }

        if (month < 1 || month > 12) {
            return { message: "월은 1~12 사이여야 합니다.", color: "validation-error" };
        }

        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            return { message: `날짜는 ${month}월의 유효한 범위 (${daysInMonth}일) 내여야 합니다.`, color: "validation-error" };
        }

        const inputDate = new Date(year, month - 1, day);
        if (inputDate > today) {
            return { message: "생년월일은 현재 날짜를 넘을 수 없습니다.", color: "validation-error" };
        }

        return { message: "", color: "validation-success" }; // 유효한 경우
    };


    useEffect(() => {
        // 상태가 모두 업데이트된 후 버튼 활성화/비활성화 상태 점검
        checkFormValidity(formData, validationMessages);
    }, [formData, validationMessages, isAuthCodeVerified]); // formData와 validationMessages가 변경될 때마다 실행

    // 버튼 활성화/비활성화 로직을 별도 함수로 분리
    const checkFormValidity = (updatedFormData, validationMessages) => {
        let isValid = true;

        // 각 필드의 유효성 검사 및 버튼 활성화 여부 판단
        if (
            !updatedFormData.userid ||
            validationMessages.useridColor === "validation-error" ||
            !updatedFormData.username ||
            validationMessages.usernameColor === "validation-error" ||
            !updatedFormData.email ||
            validationMessages.emailColor === "validation-error" ||
            !updatedFormData.password ||
            validationMessages.passwordColor === "validation-error" ||
            !updatedFormData.repassword ||
            updatedFormData.password !== updatedFormData.repassword ||
            validationMessages.repasswordColor === "validation-error" ||
            !updatedFormData.birth ||
            validationMessages.birthColor === "validation-error" ||
            !isAuthCodeVerified
        ) {
            isValid = false;
        }

        setIsFormValid(isValid); // 유효성 검사 후 버튼 활성화 여부 업데이트
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => {
            const updatedFormData = { ...prevData, [name]: value };

            // 각 필드의 유효성 검사
            let newValidationMessages = { ...validationMessages };

            if (name === "email") {
                const { message, color } = checkEmail(value);
                newValidationMessages.email = message;
                newValidationMessages.emailColor = color;
            }

            if (name === "password") {
                const { message, color } = validatePassword(value);
                newValidationMessages.password = message;
                newValidationMessages.passwordColor = color;
            }

            if (name === "repassword") {
                validatePasswords();
            }

            if (name === "birth") {
                const { message, color } = validateBirth(value);
                newValidationMessages.birth = message;
                newValidationMessages.birthColor = color;
            }

            if (name === "username") {
                const usernameRegex = /^[a-zA-Z가-힣]+$/;
                if (!usernameRegex.test(value)) {
                    newValidationMessages.username = "이름은 공백이나 숫자를 포함할 수 없습니다.";
                    newValidationMessages.usernameColor = "validation-error";
                    updatedFormData.username = ""; // 유효하지 않으면 값 초기화
                } else {
                    newValidationMessages.username = "";
                    newValidationMessages.usernameColor = "validation-success";
                }
            }

            // validationMessages 상태가 업데이트 되도록 설정
            setValidationMessages(newValidationMessages);

            return updatedFormData;
        });
    };




    // 이미지 드래기 앤 드롭 , 버튼 클릭 이벤트
    // Ref 선언
    const fileInputRef = useRef(null);


    const handleImageUpload = (file) => {
        if (file) {
            setFormData({ ...formData, profileImage: file });
            const reader = new FileReader();
            reader.onload = (event) => setImagePreview(event.target.result);
            reader.readAsDataURL(file);
            setDropdownOpen(false);
        }
    };

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 안전하게 참조
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    // 이미지 취소
    const handleCancelImage = () => {
        setFormImgeData({ ...formImgeData, profileImage: null }); // 업로드된 이미지를 초기화
        setImagePreview("/ProfileImg/anonymous.jpg"); // 기본 이미지를 다시 설정
        setFormData({ ...formData, profileImage: "/ProfileImg/anonymous.jpg" }); // formData의 profileImage도 기본 이미지로 설정
    };

    const handleDragOver = (e) => e.preventDefault();


    // password 조건 유효성 검사
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,15}$/;
        if (!password) {
            return { message: "비밀번호를 입력해주세요.", color: "validation-error" };
        }

        if (/\s/.test(password)) {
            return { message: "비밀번호에 공백은 사용할 수 없습니다.", color: "validation-error" };
        }

        if (!passwordRegex.test(password)) {
            return { message: "비밀번호는 영문+숫자 조합, 8~15자리여야 합니다.", color: "validation-error" };
        }

        return { message: "사용가능한 비밀번호입니다.", color: "validation-success" };
    };



    // ID 실시간 유효성 검사
    const checkUserId = async (userid) => {
        try {
            // 정규식 검사
            if (!/^[a-zA-Z0-9]{4,12}$/.test(userid)) {
                setValidationMessages((prev) => ({
                    ...prev,
                    userid: "ID는 4~12자의 영문 및 숫자여야 합니다.",
                    useridColor: "error", // 오류 색상 적용
                }));
                checkFormValidity(formData, { ...validationMessages, useridColor: "error" });
                return;
            }

            // 백엔드 중복 검사
            const response = await axios.post("https://www.wanderlog.shop/user/check-id", { userid });
            const available = response.data.available;

            // 상태 업데이트 후 바로 버튼 활성화 상태 갱신
            setValidationMessages((prev) => ({
                ...prev,
                userid: available ? "사용 가능한 ID입니다." : "이미 사용 중인 ID입니다.",
                useridColor: available ? "success" : "validation-error",
            }));

            // 중복 검사 결과에 따라 버튼 활성화 상태 갱신
            checkFormValidity(formData, { ...validationMessages, useridColor: available ? "success" : "validation-error" });

        } catch (error) {
            console.error("ID 중복 확인 중 오류 발생:", error);
            setValidationMessages((prev) => ({
                ...prev,
                userid: "서버 오류로 ID를 확인할 수 없습니다.",
                useridColor: "validation-error", // 오류 색상 적용
            }));

            checkFormValidity(formData, { ...validationMessages, useridColor: "validation-error" });
        }
    };



    // email 형식 및 중복
    const checkEmail = async (email) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setValidationMessages((prev) => ({
                ...prev,
                email: "유효한 이메일 형식을 입력하세요.",
                emailColor: "validation-error", // 오류 색상
            }));
            return false; // 이메일 형식 오류
        }

        try {
            // 서버 중복 확인 요청
            const response = await axios.post("https://www.wanderlog.shop/user/check-email", { email });

            setValidationMessages((prev) => ({
                ...prev,
                email: response.data.available
                    ? "사용 가능한 이메일입니다."
                    : "이미 등록된 이메일입니다.",
                emailColor: response.data.available ? "validation-success" : "validation-error",
            }));

            return response.data.available; // 서버 중복 확인 결과 반환
        } catch (error) {
            console.error("이메일 확인 오류:", error);
            setValidationMessages((prev) => ({
                ...prev,
                email: "이메일 중복 확인 중 오류가 발생했습니다.",
                emailColor: "validation-error", // 오류 색상
            }));

            return false; // 서버 오류
        }
    };

    useEffect(() => {
        let countdown;
        if (timeSee && timer > 0 && !isAuthCodeVerified) {
            countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }

        // 타이머가 0초가 되면 인증번호 만료 메시지 표시
        if (timer === 0) {
            setValidationMessages((prevMessages) => ({
                ...prevMessages,
                email: "인증번호가 만료되었습니다. 인증번호를 재발급받으세요.",
            }));
            setAuthCodeSent(false);
        }

        return () => clearInterval(countdown);
    }, [timeSee, timer, isAuthCodeVerified]);


    const resetAuthState = () => {
        setAuthCodeSent(false); // 인증 코드 발송 상태 초기화
        setTimer(180); // 타이머 초기화
        setIsAuthCodeVerified(false); // 인증 상태 초기화
        setFormData((prev) => ({ ...prev, authCode: "" })); // 인증 코드 필드 초기화
        setValidationMessages((prevMessages) => ({
            ...prevMessages,
            authCode: "",
        }));
    };



    // 이메일 인증 코드 요청 함수
    const sendAuthCode = async () => {
        const email = formData.email.trim(); // 이메일 값 가져오기

        // 이메일 입력값이 없는 경우
        if (!email) {
            setValidationMessages((prev) => ({
                ...prev,
                email: "값을 입력하세요.",
                emailColor: "validation-error",
            }));
            setAuthCodeSent(false); // 인증 코드 상태 초기화
            return;
        }

        // 이메일 형식이 올바르지 않은 경우
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setValidationMessages((prev) => ({
                ...prev,
                email: "올바른 이메일 형식으로 작성해주세요.",
                emailColor: "validation-error",
            }));
            setAuthCodeSent(false); // 인증 코드 상태 초기화
            return;
        }

        try {
            alert('인증번호가 발송될 때 까지 잠시만 기다려주세요!')
            const response = await axios.post("https://www.wanderlog.shop/user/send-auth-code", {
                email: email,
            });

            if (response.data.status === "success") {
                resetAuthState(); // 상태 초기화
                const message = isFirstSend
                    ? "인증번호가 발송되었습니다."
                    : "인증번호가 재발송되었습니다.";
                setValidationMessages((prev) => ({
                    ...prev,
                    email: message,
                    emailColor: "validation-success",
                }));
                setAuthCodeSent(true); // 인증 코드 상태 활성화
                setIsFirstSend(false); // 최초 발송 이후 상태 변경
            } else {
                setValidationMessages((prev) => ({
                    ...prev,
                    email: response.data.message || "인증 코드 발송에 실패했습니다.",
                    emailColor: "validation-error",
                }));
                setAuthCodeSent(false); // 인증 코드 상태 초기화
            }
        } catch (error) {
            setValidationMessages((prev) => ({
                ...prev,
                email: "서버 오류로 인증 코드를 발송할 수 없습니다.",
                emailColor: "validation-error",
            }));
            setAuthCodeSent(false); // 인증 코드 상태 초기화
        }
    };


    const verifyAuthCode = async () => {
        try {
            const response = await axios.post("https://www.wanderlog.shop/user/verify-auth-code", {
                email: formData.email,
                code: formData.authCode,
            });

            if (response.data.message.includes("완료")) {
                setValidationMessages((prevMessages) => ({
                    ...prevMessages,
                    authCode: "인증이 완료되었습니다.",
                    authCodeColor: "validation-success", // 성공 색상
                }));
                alert('이메일 인증이 완료되었습니다!');
                setIsAuthCodeVerified(true);

            } else {
                setValidationMessages((prevMessages) => ({

                    ...prevMessages,
                    authCode: "인증번호가 올바르지 않습니다.",
                    authCodeColor: "validation-error", // 오류 색상
                }));
                setIsAuthCodeVerified(false);
            }
        } catch (error) {
            setValidationMessages((prevMessages) => ({
                ...prevMessages,
                authCode: "서버 오류로 인증을 완료할 수 없습니다.",
                authCodeColor: "validation-error", // 오류 색상
            }));
            setIsAuthCodeVerified(false);
        }
    };


    // Form 데이터 전송
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 이메일 인증 여부 확인
        if (!isAuthCodeVerified) {
            alert("이메일 인증을 완료해주세요.");
            return;
        }

        // 모든 유효성 검사 확인
        const { userid, username, password, repassword, email, birth } = formData;
        setIsFormValid(false);

        if (!userid || validationMessages.useridColor === "error") {
            alert("아이디를 올바르게 입력하세요.");
            return;
        }

        if (!username || validationMessages.usernameColor === "validation-error") {
            alert("이름을 올바르게 입력하세요.");
            return;
        }

        if (!email || validationMessages.emailColor === "error") {
            alert("이메일을 올바르게 입력하세요.");
            return;
        }

        if (!password || validationMessages.passwordColor === "error") {
            alert("비밀번호를 올바르게 입력하세요.");
            return;
        }

        if (!repassword || password !== repassword) {
            alert("비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        if (!birth || validationMessages.birthColor === "validation-error") {
            alert("생년월일을 올바르게 입력하세요.");
            return;
        }

        // 유효성 검사를 통과한 경우에만 데이터 전송
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key !== "profileImage") data.append(key, formData[key]);
        });

        // profileImage와 username을 추가
        data.append("profileImage", formData.profileImage || "/ProfileImg/anonymous.jpg");

        try {
            const response = await axios.post("https://www.wanderlog.shop/user/join", data);
            if (response.status === 200) {
                alert("회원가입이 완료되었습니다.");
                window.location.href = "/user/login";
            }
        } catch (error) {
            alert("회원가입 중 오류가 발생했습니다. 다시 시도하세요.");
            setIsFormValid(false);
        }
    };


    return (
        <div className="join-page">
            <header className="join-page-header">
                <div className="join-page-header-content">
                    <Link to="/"><img src={HeaderLogo}></img></Link>
                </div>

            </header>
            <div className="join-content">
                <img className="join-content__leftImg" src={signUpImg}></img>

                <div className="join-form-container">
                    <form className="join-form" onSubmit={handleSubmit}>
                        <h1>회원가입</h1>

                        <div className="join-profile-content">
                            {/* 프로필 */}
                            <label
                                htmlFor="imgupload"
                                className="image-preview-container"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <img src={imagePreview} alt="미리보기" className="circle-preview" />
                            </label>

                            {/* 드롭다운 버튼 */}
                            <span id="dropdown-button" className="material-symbols-outlined" onClick={toggleDropdown}>
                                add_a_photo
                            </span>

                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <button
                                        type="button"
                                        onClick={() => { handleFileInputClick(); }}
                                        className="dropdown-item" >
                                        이미지 업로드
                                    </button>
                                    {formData.profileImage && (
                                        <button
                                            type="button"
                                            onClick={() => { handleCancelImage(); setDropdownOpen(false); }}
                                            className="dropdown-item" >
                                            기본 이미지로
                                        </button>
                                    )}
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => handleImageUpload(e.target.files[0])}
                            />
                        </div>

                        <div className="join-id-content">
                            {/* 아이디 */}
                            <label htmlFor="userId">아이디</label>
                            <input

                                type="text"
                                name="userid"
                                placeholder="아이디를 입력해주세요."
                                id="userId"
                                onChange={(e) => {
                                    handleChange(e);
                                    checkUserId(e.target.value);
                                }}
                            />
                            {/* 아이디 유효성 */}
                            {validationMessages.userid && (
                                <div
                                    className={`validation-message ${validationMessages.useridColor === "success"
                                        ? "validation-success"
                                        : "validation-error"
                                        }`}
                                >
                                    {validationMessages.userid}
                                </div>
                            )}
                        </div>

                        <div className="join-username-content">
                            {/* 이름 */}
                            <label htmlFor="userName">이름</label>
                            <input
                                type="text"
                                name="username"
                                id="userName"
                                placeholder="이름을 입력해주세요."
                                onChange={handleChange}
                            />
                            {/* 이름 유효성 */}
                            {validationMessages.username && (
                                <div className={`validation-message ${validationMessages.usernameColor}`}>
                                    {validationMessages.username}
                                </div>
                            )}
                        </div>

                        {/* 이메일 */}
                        <div className={`join-email-content ${validationMessages.email ? 'has-message' : ''} ${validationMessages.username ? 'name-message' : ''}`}>
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="이메일을 입력해주세요."
                                onChange={handleChange}
                                onBlur={(e) => checkEmail(e.target.value)}
                                disabled={isAuthCodeVerified} // 인증이 완료되면 이메일 입력칸 비활성화
                            />
                            <button
                                className="emailbutton"
                                type="button"
                                onClick={() => {
                                    if (validationMessages.emailColor === "validation-success" && !isAuthCodeVerified) {
                                        sendAuthCode();
                                    } else {
                                        alert("올바른 이메일 형식을 입력하세요.");
                                    }
                                }}
                                disabled={isAuthCodeVerified} // 인증 완료된 경우 버튼 비활성화
                            >
                                {isAuthCodeVerified ? '인증 완료' : '인증 코드 받기'}
                            </button>
                            {/* 이메일 유효성 및 인증 완료 메시지 */}
                            <div className={`validation-message ${isAuthCodeVerified ? 'validation-success' : validationMessages.emailColor}`}>
                                {isAuthCodeVerified ? '인증이 완료되었습니다.' : validationMessages.email}
                            </div>

                        </div>

                        {/* 인증코드 */}
                        {authCodeSent && validationMessages.emailColor === "validation-success" && !isAuthCodeVerified && (
                            <div className={`auth-codebox ${validationMessages.authCode ? 'auth-message' : ''}`}>
                                <div className="auth-code-wrapper">
                                    <input
                                        type="text"
                                        name="authCode"
                                        className="auth-code"
                                        placeholder="인증 코드를 입력해주세요"
                                        onChange={handleChange}
                                    />
                                    <div id="timer">
                                        {Math.floor(timer / 60)}:{timer % 60}
                                    </div>
                                    <button className="verifybutton" type="button" onClick={verifyAuthCode}>
                                        인증 코드 확인
                                    </button>
                                </div>
                                {validationMessages.authCode && (
                                    <div className={`validation-message ${validationMessages.authCodeColor}`}>
                                        {validationMessages.authCode}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* 비밀번호 */}
                        <div className="join-password-content">
                            <label htmlFor="password">비밀번호</label>
                            <input id="password" type="password" name="password" placeholder="비밀번호를 입력해주세요." onChange={handleChange} />
                            {validationMessages.password && (
                                <div className={`validation-message ${validationMessages.passwordColor}`}>
                                    {validationMessages.password}
                                </div>
                            )}
                            {/* 비밀번호 확인 */}
                            <input id="rePassword" type="password" name="repassword" placeholder="비밀번호를 다시 한번 입력해주세요." onChange={handleChange} />
                            {validationMessages.repassword && (
                                <div className={`validation-message ${validationMessages.repasswordColor}`}>
                                    {validationMessages.repassword}
                                </div>
                            )}
                        </div>

                        <div className="join-birth-content">
                            {/* 생년월일 */}
                            <label htmlFor="birth">생년월일</label>
                            <input
                                type="text"
                                name="birth"
                                id="birth"
                                placeholder="생년월일(YYYYMMDD)을 입력해주세요"
                                maxLength={8}
                                onChange={handleChange}
                            />
                            {/* 생년월일 유효성 */}
                            {validationMessages.birth && (
                                <div className={`validation-message ${validationMessages.birthColor}`}>
                                    {validationMessages.birth}
                                </div>
                            )}
                        </div>


                        <div className="join-btn">
                            {/* 회원가입 버튼 */}
                            <button type="submit"
                                disabled={!isFormValid} // 유효하지 않으면 비활성화
                                className={isFormValid ? "active" : "inactive"} >
                                회원가입
                            </button>
                        </div>

                    </form>

                </div >

            </div >

        </div>

    );
};

export default Join;
