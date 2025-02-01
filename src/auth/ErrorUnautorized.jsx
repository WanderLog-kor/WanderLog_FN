import React from "react";
import { Link } from "react-router-dom";

const ErrorUnauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>로그인이 필요합니다.</h2>
      <p>이 페이지를 보려면 로그인이 필요합니다.</p>
      <Link to="/login">
        <button>로그인 페이지로 이동</button>
      </Link>
    </div>
  );
};

export default ErrorUnauthorized;
