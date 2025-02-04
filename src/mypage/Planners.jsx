import React, { useState, useEffect } from "react";
import axios from "axios";
import useMyPlanner from "./useMyPlanner";
import useLikePlanner from "./useLikePlanner";
import { useNavigate } from "react-router-dom";
import "./Planners.scss";
import LikedPlannerList from "./components/LikedPlannerList";
import Image from "../images/main.jpg";

const Planners = ({ detailProfile }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loginStatus, setLoginStatus] = useState([]);
  const [error, setError] = useState(null);
  // const [activeTab, setActiveTab] = useState("summary");  // 현재 활성화된 탭을 관리
  // const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();
  const [myPlanner, setMyPlanner] = useState(true);

  // 내가 만든 플래너와 좋아요한 플래너 데이터 가져오기
  const { planners } = useMyPlanner();

  //좋아요 한 요소 불러오기
  const { likedPlanners } = useLikePlanner(userData?.userid) || {likedPlanners: [{}]};
  console.log(likedPlanners);
  // 사용자 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true); // 로딩 시작
        console.log("사용자 데이터 요청 시작");

        // 쿠키 인증
        await axios.post(
          "http://localhost:9000/api/cookie/validate",
          {},
          { withCredentials: true }
        ).then(response => {
          setLoginStatus(response.data);
        })
        .catch(error=>{
          setLoginStatus('');
        });

        // 사용자 정보 가져오기
        const userResponse = await axios.get(
          "http://localhost:9000/user/mypage",
          { withCredentials: true }
        );

        console.log("사용자 데이터 가져오기 성공:", userResponse.data);
        setUserData(userResponse.data); // 사용자 데이터 업데이트
      } catch (err) {
        console.error("사용자 데이터를 가져오는 중 오류:", err);
        setError("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 로딩 종료
        console.log("사용자 데이터 요청 종료");
      }
    };

    fetchUserData();
  }, []);
  
  // 플래너 클릭 핸들러
  const handlePlannerClick = (plannerID) => {
    if (!planners || planners.length === 0) {
      console.warn("플래너 데이터가 초기화되지 않았습니다.");
      return;
    }
    const plannerItem = planners.find((item) => item.plannerID === plannerID);
    if (!plannerItem) {
      console.warn("PlannerID에 해당하는 플래너가 없습니다.");
      return;
    }
    
    navigate(`/planner/board/destination?plannerID=${plannerID}`, {state: { plannerItem } });
  };

  const handleClickMyPlanner = () => {
    setMyPlanner(true);
  };

  const handleClickLikePlanner = () => {
    setMyPlanner(false);

  }

  return (
    <>
      {!detailProfile && (
        <div className={`planner-container`}>
          <div className="my-planner-container">
            <div className="planner-option">
              <div className={`planner-option-btn ${myPlanner ? "active" : ""}`} onClick={() => handleClickMyPlanner()}>
                나의 일정{planners?.length}
              </div>
              <div className={`planner-option-btn ${!myPlanner ? "active" : ""}`} onClick={() => handleClickLikePlanner()} >나의 관심목록</div>
            </div>
            <div className="planner-titletag">{!myPlanner ? "나의 관심목록" : "나의 일정"}</div>

            <div className="planner-list">
              {myPlanner ? (
                planners?.length === 0 ? (
                  <p>작성된 플래너가 없습니다.</p>
                ) : (
                  <ul>
                    {planners?.map((planner, index) => (
                      <li
                        key={planner.plannerID || index}
                        className="planner-item"
                        onClick={() => handlePlannerClick(planner.plannerID)}
                      >
                        <div className="planner-thumbnail">
                          <img src={planner.destinations?.[0]?.image || Image} alt="없으" />
                        </div>
                        <div className="planner-desription">
                          <p>지역: {planner.area}</p>
                          <h2>{planner.plannerTitle}</h2>
                          <p>여행 일수: {planner.day}일</p>
                          <p>여행 일정 : {planner.startDate} ~ {planner.endDate}</p>

                          <p>설명: {planner.description}</p>
                          <p>생성 날짜: {planner.createAt.split('T')[0]}</p>

                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <LikedPlannerList likedPlanners={likedPlanners} handlePlannerClick={handlePlannerClick} userid={userData?.userid} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Planners;
