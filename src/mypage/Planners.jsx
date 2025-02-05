import React, { useState, useEffect } from "react";
import axios from "axios";
import useMyPlanner from "./useMyPlanner";
import useLikePlanner from "./useLikePlanner";
import { useNavigate } from "react-router-dom";
import "./Planners.scss";
import LikedPlannerList from "./components/LikedPlannerList";
import Image from "../images/main.jpg";
import moreIcon from './images/more-btn.png';

const Planners = ({ detailProfile }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("myCourse"); // 카테고리 탭
  const [expandedPlanner, setExpandedPlanner] = useState(null);
  const navigate = useNavigate();
  const [myPlanner, setMyPlanner] = useState(true);

  // 내가 만든 플래너와 좋아요한 플래너 데이터 가져오기
  const { planners } = useMyPlanner();

  //좋아요 한 요소 불러오기
  const { likedPlanners } = useLikePlanner(userData?.userid);
  console.log("라이크입니다", likedPlanners);

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
        );

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
    console.log('plannerItem : ', plannerItem);
    navigate(`/planner/board/destination?plannerID=${plannerID}`, {
      state: { plannerItem },
    });
    

  };

  // 삼선버튼 클릭시 편집, 삭제 버튼 띄우기
  const toggleOptions = (plannerID) => {
    setExpandedPlanner(expandedPlanner === plannerID ? null : plannerID);
  };

  const handleClickMyPlanner = (tab) => {
    setActiveTab(tab);
    setMyPlanner(true);
  };

  const handleClickLikePlanner = (tab) => {
    setActiveTab(tab);
    setMyPlanner(false);
  }

  // 플래너 편집
  const handleEdit = (plannerID) => {

  };
  // 플래너 삭제
  const handleDelete = (plannerID) => {

  };

  return (
    <>
      {!detailProfile && (
        <div className={`planner-container`}>
          <div className="my-planner-container">
            {/* <div className="planner-option">
              <div className={`planner-option-btn ${myPlanner ? "active" : ""}`} onClick={() => handleClickMyPlanner("board-myCourse")}>
                나의 일정
              </div>
              <div className={`planner-option-btn ${!myPlanner ? "active" : ""}`} onClick={() => handleClickLikePlanner()} >나의 관심목록</div>
            </div> */}
            <div className="planner-tap">
              <ul>
                <li
                  className={`planner-option-myCourse ${myPlanner ? "on" : ""}`}
                  onClick={() => handleClickMyPlanner("myCourse")}
                  style={activeTab === "myCourse" ? { pointerEvents: "none" } : {}}>
                  <span>나의 일정</span>
                  <em>{planners?.length}</em>
                </li>
                <li
                  className={`planner-option-like ${!myPlanner ? "on" : ""}`}
                  onClick={() => handleClickLikePlanner("like")}
                  style={activeTab === "like" ? { pointerEvents: "none" } : {}}>
                  <span>나의 관심목록</span>
                </li>
              </ul>
            </div>

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

                      >
                        <div className="planner-thumbnail" onClick={() => handlePlannerClick(planner.plannerID)}>
                          <img src={planner.destinations?.[0]?.image || Image} alt="없으" />
                        </div>
                        <div className="planner-info">
                          <p className="planner-duration">{planner.startDate} ~ {planner.endDate}</p>
                          <h2 className="planner-title">{planner.plannerTitle}</h2>
                          <p className="planner-area">{planner.area}</p>
                          <p className="planner-created-at">{planner.createAt.split('T')[0]} 생성</p>
                          <div className="planner-moreIcon">
                            <img className="" src={moreIcon} onClick={() => toggleOptions(planner.plannerID)} />

                            {expandedPlanner === planner.plannerID && (
                              <div className="planner-options">
                                <button onClick={() => handleEdit(planner.plannerID)}>편집</button>
                                <button onClick={() => handleDelete(planner.plannerID)}>삭제</button>
                              </div>

                            )}
                          </div>
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
