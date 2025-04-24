import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useLoginStatus } from "../auth/PrivateRoute";


const Logout = () => {
    const navigate = useNavigate();
    const {loginStatus} = useLoginStatus();
    useEffect(() => {


        axios.post('https://www.wanderlog.shop/user/logout',{},{withCredentials:true})
        .then((response)=>{
            localStorage.removeItem("userid");
            alert("로그아웃합니다");
            window.location.href="/";
        })      
        .catch((error) =>{
        });
    },[navigate]);


    return (
        <div>
            <h1>로그아웃 중...</h1>
        </div>
    );
};

export default Logout;