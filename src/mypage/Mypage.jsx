import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Planners from "./Planners";
import MyInformation from "./MyInformation";
import HeaderLogo from '../components/logoImage/logo2.png'
import { useLoginStatus } from "../auth/PrivateRoute";
import './Mypage.scss';

const Mypage = () => {

  const [detailProfile, setDetailProfile] = useState(false);
  const { loginStatus } = useLoginStatus();

  return (
    <>
      <header className="mypage-header">
        <div className="mypage-header-content">
          <Link to="/"><img src={HeaderLogo}></img></Link>
          <div className="header-btns">
            <Link to="/user/logout">
              <button className="logout-btn">로그아웃</button>
            </Link>

          </div>
        </div>


      </header>
      <div className="mypage-wrapper">

        <MyInformation detailProfile={detailProfile} setDetailProfile={setDetailProfile} />

        {!detailProfile && <Planners detailProfile={detailProfile} />}
      </div>
    </>
  );
};

export default Mypage;
