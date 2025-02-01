import React from "react";
import { Link } from "react-router-dom";

const ErrorForbidden = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>접근이 거부되었습니다.</h2>
      <p>이 페이지를 볼 수 있는 권한이 없습니다.</p>
      <Link to="/">
        <button>홈으로 이동</button>
      </Link>
    </div>
  );
};

export default ErrorForbidden;
