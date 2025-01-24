
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';
import LogoImage from './logoImage/logo1.png';
import axios from 'axios';
import { useState, useEffect } from "react";
import { useLoginStatus } from '../auth/PrivateRoute';


const Header = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const { loginStatus } = useLoginStatus();

    useEffect(() => {

        const handleScroll = () => {
            if (window.scrollY > 550) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

        }
        
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }

    }, []);


    // 특정 경로에서는 Header를 표시하지 않음
    if (location.pathname === '/planner/board/destination') {
        return null;
    }
    if (location.pathname === '/makePlanner') {
        return null;
    }

    return (
        <header className={`header-wrapper ${isScrolled ? "scrolled" : ""}`}>

            <div className="header-content">
                <Link className="header-logo" to="/">

                    <span className="logo-text">WanderLog</span>
                    {/* <img className="logo-icon" src={LogoImage} alt="Plane Icon" /> */}

                </Link>


                <div className="header-btns">

                    {/* 로그인 여부에 따라 표시될 버튼 */}
                    {!loginStatus ? (
                        <>
                            <Link to="/user/login">
                                <button className="login-btn">로그인</button>
                            </Link>
                            <Link to="/user/join">
                                <button className="join-btn">회원가입</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/user/mypage">
                                <button className="join-btn">마이페이지</button>
                            </Link>

                            <Link to="/user/logout">
                                <button className="logout-btn">로그아웃</button>
                            </Link>
                        </>
                    )}

                </div>


            </div>

        </header>
    );
};

export default Header;
