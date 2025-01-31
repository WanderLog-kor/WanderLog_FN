import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Planners from "./Planners";
import MyInformation from "./MyInformation";

const Mypage = () => {

  const [detailProfile,setDetailProfile] = useState(false);

  return (
    <div>
        <MyInformation detailProfile={detailProfile} setDetailProfile={setDetailProfile}/>

        {!detailProfile && <Planners/>}
    </div>
  );
};

export default Mypage;
