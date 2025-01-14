import React from "react";
import { Routes, Route } from "react-router-dom";
import Mypage from "./Mypage";
import Destination from "../board/BoardInfo";

const MypageRouter = () => {
  return (
    <Routes>
      <Route path="user/mypage" element={<Mypage />} />
      <Route path="/destination" element={<Destination />} />
    </Routes>
  );
};

export default MypageRouter;
