import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Context 생성
const LoginContext = createContext();

// 로그인 정보를 관리하는 커스텀 Hook
export const useLoginStatus = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {

    const [loginStatus, setLoginStatus] = useState(false);  // 로그인 상태
    const [loginData, setLoginData] = useState(null);  // 로그인 정보
    const navigate = useNavigate();  // navigate 훅 사용

    // 로그인 상태 확인
    useEffect(() => {
        const validateCookie = async () => {
            try {
                const response = await axios.post(
                    "https://www.wanderlog.shop/api/cookie/validate",
                    {},
                    { withCredentials: true }
                );

                // 로그인 성공 시 로그인 정보 저장
                setLoginStatus(true);
                setLoginData(response.data);
            } catch (err) {
                await handleTokenRefresh();
            }
        };

        const handleTokenRefresh = async () => {
            const userid = localStorage.getItem("userid");
            if (!userid) {
                console.error("userid가 로컬 스토리지에 없습니다");
                setLoginStatus(false);
                setLoginData(null);
                return;
            }

            try {
                await refreshAccessToken(userid);  // 리프레시 토큰 갱신
                const retryResponse = await axios.post(
                    "https://www.wanderlog.shop/api/cookie/validate",
                    {},
                    { withCredentials: true }
                );
                // 로그인 성공 시 로그인 정보 저장
                setLoginStatus(true);
                setLoginData(retryResponse.data);
            } catch (refreshError) {
                console.error("토큰 갱신 실패:", refreshError);
                setLoginStatus(false);
                setLoginData(null);
                localStorage.removeItem("userid");
            }
        };

        validateCookie();  // 쿠키 유효성 검사

    }, [navigate]);

    return (
        <LoginContext.Provider value={{ loginStatus, loginData }}>
            {children}
        </LoginContext.Provider>
    );
};

// 엑세스 토큰 갱신 함수
const refreshAccessToken = async (userid) => {
    try {
        const response = await axios.post(
            'https://www.wanderlog.shop/api/cookie/refresh',
            { userid },
            { withCredentials: true, headers: { userid } }
        );
        return response.data;
    } catch (error) {
        localStorage.removeItem("userid");
        throw new Error("엑세스 토큰 재발급 실패");
    }
};

// PrivateRoute 컴포넌트
const PrivateRoute = ({ element, ...rest }) => {
    const { loginStatus } = useLoginStatus();  // 로그인 상태 가져오기
    const navigate = useNavigate();  // navigate 훅 사용

    // 로그인 상태 확인
    if (loginStatus === null) {
        return <div>Loading...</div>;  // 로그인 상태를 확인하는 동안 로딩 표시
    }

    if (!loginStatus) {
        navigate("/user/login");  // 로그인되지 않았다면 로그인 페이지로 리디렉션
        return null;  // 아무것도 렌더링하지 않음
    }

    // 로그인 상태가 확인되면 페이지 렌더링
    return React.cloneElement(element, { loginStatus });
};

export default PrivateRoute;
