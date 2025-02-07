import React, { useState, useEffect } from "react";
import axios from "axios";
import useMyPlanner from "./useMyPlanner";
import useLikePlanner from "./useLikePlanner";
import { useNavigate } from "react-router-dom";
import "./Planners.scss";
import LikedPlannerList from "./components/LikedPlannerList";
import Image from "../images/main.jpg";
import moreIcon from "./images/more-btn.png";

const ITEMS_PER_PAGE = 8; // 한 번에 표시할 아이템 개수

const Planners = ({ detailProfile }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loginStatus, setLoginStatus] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("myCourse");
  const [expandedPlanner, setExpandedPlanner] = useState(null);
  const navigate = useNavigate();
  const [myPlanner, setMyPlanner] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 내가 만든 플래너 데이터 가져오기
  const { planners } = useMyPlanner();

  // 좋아요 한 플래너 데이터 가져오기
  const { likedPlanners } = useLikePlanner(userData?.userid) || { likedPlanners: [{}] };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log("사용자 데이터 요청 시작");

        // 사용자 정보 가져오기
        const userResponse = await axios.get(
          "http://localhost:9000/user/mypage",
          { withCredentials: true }
        );

        console.log("사용자 데이터 가져오기 성공:", userResponse.data);
        setUserData(userResponse.data);
      } catch (err) {
        console.error("사용자 데이터를 가져오는 중 오류:", err);
        setError("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
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

    navigate(`/planner/board/destination?plannerID=${plannerID}`, {
      state: { plannerItem },
    });
  };

  // "더보기" 버튼 클릭 시 8개씩 추가 로드
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };
  const areaCodeMap = {
    서울: "1",
    인천: "2",
    대전: "3",
    대구: "4",
    광주: "5",
    부산: "6",
    울산: "7",
    세종: "8",
    경기: "31",
    강원도: "32",
    충북: "33",
    충남: "34",
    경북: "35",
    경남: "36",
    전북: "37",
    전남: "38",
    제주: "39",
  };

  const handleClickPlannerUpdate = () => {

    const plannerData = likedPlanners[0];
    const areaCode = areaCodeMap[plannerData.area] || "0"; //areaName 없으면 도시코드 0

    const updateData = {
      areaName: plannerData.area,
      areaCode: areaCode,
      startDate: plannerData.startDate,
      endDate: plannerData.endDate,
      plannerid: plannerData.plannerID,
      title: plannerData.plannerTitle,
      description: plannerData.description,
      isPublic: plannerData.public,
      day: plannerData.day,
      userid: plannerData.userId,
      destinations: plannerData.destinations,
    }
    navigate('/makePlanner', { state: { updatePlannerData: updateData } });
  }

  const handleClickPlannerDelete = () => {
    axios.post('http://localhost:9000/planner/deletePlanner',
      { plannerid: String(likedPlanners[0].plannerID) },
      { 'Content-Type': 'application/json' }
    )
      .then(resp => {
        alert('플래너 삭제에 성공했습니다!');
        window.location.reload();
      })
      .catch(err => {
        console.error("Error Deleting to my course:", err);
        alert("플래너 삭제에 실패했습니다. 다시 시도해주세요.");
      })
  }
  return (
    <>
      {!detailProfile && (
        <div className="planner-container">
          <div className="my-planner-container">
            <div className="planner-tap">
              <ul>
                <li
                  className={`planner-option-myCourse ${myPlanner ? "on" : ""}`}
                  onClick={() => {
                    setActiveTab("myCourse");
                    setMyPlanner(true);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  style={activeTab === "myCourse" ? { pointerEvents: "none" } : {}}
                >
                  <span>나의 일정</span>
                  <em>{planners?.length}</em>
                </li>
                <li
                  className={`planner-option-like ${!myPlanner ? "on" : ""}`}
                  onClick={() => {
                    setActiveTab("like");
                    setMyPlanner(false);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  style={activeTab === "like" ? { pointerEvents: "none" } : {}}
                >
                  <span>나의 관심목록</span>
                </li>
              </ul>
            </div>

            <div className="planner-list">
              {myPlanner ? (
                planners?.length === 0 ? (
                  <p>작성된 플래너가 없습니다.</p>
                ) : (
                  <>
                    <ul>
                      {planners.slice(0, visibleCount).map((planner, index) => (
                        <li key={planner.plannerID || index} className="planner-item">
                          <div className="planner-thumbnail" onClick={() => handlePlannerClick(planner.plannerID)}>
                            <img src={planner.destinations?.[0]?.image || Image} alt="없음" />
                          </div>
                          <div className="planner-info">
                            <p className="planner-duration">
                              {planner.startDate} ~ {planner.endDate}
                            </p>
                            <h2 className="planner-title">{planner.plannerTitle}</h2>
                            <p className="planner-area">{planner.area}</p>
                            <p className="planner-created-at">
                              {planner.createAt.split("T")[0]} 생성
                            </p>
                            <div className="planner-moreIcon">
                              <img src={moreIcon} onClick={() => setExpandedPlanner(expandedPlanner === planner.plannerID ? null : planner.plannerID)} />
                              {expandedPlanner === planner.plannerID && (
                                <div className="planner-options">
                                  <button onClick={handleClickPlannerUpdate}>편집</button>
                                  <button onClick={handleClickPlannerDelete}>삭제</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* "더보기" 버튼 (더 이상 보여줄 항목이 없으면 숨김) */}
                    {visibleCount < planners.length && (
                      <div className="mypage-pagination">
                        <button onClick={handleLoadMore} className="load-more-btn">
                          더보기
                        </button>
                        <p className="pagination-info">{visibleCount} / {planners.length}개 항목</p>
                      </div>
                    )}
                  </>
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
