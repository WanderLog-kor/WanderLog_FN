import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ element, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [cookie, setCookie] = useState(null);
    const navigate = useNavigate();  // navigate 훅 사용

    useEffect(() => {

        axios.post('http://localhost:9000/api/cookie/validate', {}, { withCredentials: true })
            .then(response => {
                setIsAuthenticated(true);
                setCookie(response.data);  // 응답 데이터로 쿠키 정보 설정
                console.log("쿠키 정보:", response.data);  // 쿠키 정보를 콘솔에 출력

                const userid = localStorage.getItem("userid");

                if (userid) {
                    console.log("Userid found in 로컬스토리지:", userid);
                } else {
                    console.log("userid 값이 로컬 스토리지에 없습니다.");
                }
            })
            .catch(err => {
                setIsAuthenticated(false);
                alert('로그인이 필요한 서비스입니다.')
                navigate("/user/login");
                console.log("쿠키 오류:", err);  // 쿠키 정보를 콘솔에 출력
            });
    }, [navigate]);

    if (isAuthenticated === null) {
        return <div>Loading...</div> //인증 상태가 결정될 때까지 대기
    }


    return isAuthenticated ? React.cloneElement(element, { cookie }) : null;
};


const refreshAccessToken = async (userid, refreshToken) => {
    try {
        const response = await axios.post('http://localhost:9000/api/refresh', { userid, refreshToken }, {
            withCredentials: true,
        });
        return response.data; //엑세스 토큰과 리프레시 토큰 반환
    } catch (error) {
        console.log("엑세스 토큰 재발급 실패", error);
        throw new Error("엑세스 토큰 재발급 실패");
    }
};


export default PrivateRoute;