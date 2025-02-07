import { useEffect, useState } from "react";
import axios from "axios";
import PlanList from "./PlanList";
import TouristList from "./Tourist";
import TravelCourseList from "./Travelcourse";

import touristIcon from './images/tourist-attraction.png';
import travelCourseIcon from './images/travel-guide.png';
import courseIcon from './images/itinerary.png';

const LikedPlannerList = ({ likedPlanners, handlePlannerClick, userid }) => {
  const [category, setCategory] = useState("plan");
  const [likedTourists, setLikedTourists] = useState([]);
  const [likedTravelCourse, setLikedTravelCourse] = useState([]);
  const [likedPlannersState, setLikedPlannersState] = useState(likedPlanners);

  // 각 카테고리 필터 상태
  const filteredPlanners = (Array.isArray(likedPlannersState) ? likedPlannersState : []).filter((planner) => {
    if (category === "plan") return true;
    if (category === "tourist") return false;
    if (category === "travelcourse") return false;
    return true;
  });

  // 여행 계획 좋아요 취소 후 데이터 리로딩
  const removePlanLike = (plannerId) => {
    const isConfirmed = window.confirm("좋아요를 취소하시겠습니까?");
    if (isConfirmed) {
      axios
        .post(
          `https://www.wanderlog.shop/planner/board/toggleLike`,
          {
            plannerID: plannerId,
            userId: userid
          },
          {
            headers: {
              'Content-Type': 'application/json', // JSON 포맷으로 전송
            },
            withCredentials: true
          }) // 쿠키 포함
        .then((response) => {
          // 좋아요 취소 후, 여행 계획 데이터만 재로딩
          fetchLikedPlanners();
        })
        .catch((error) => {
          console.error("좋아요 취소 실패:", error);
        });
    }
  };

  // 여행 계획 데이터 새로 불러오기
  const fetchLikedPlanners = async () => {
    if (!userid) return;
    try {
      const response = await axios.get(`https://www.wanderlog.shop/user/mypage/${userid}/liked-planners`, {
        withCredentials: true
      });
      setLikedPlannersState(response.data); // 받아온 데이터로 상태 업데이트
    } catch (err) {
    }
  };

  // 관광지 데이터 새로 불러오기 (카테고리 변경 시만)
  const fetchLikedTourists = async () => {
    if (!userid) return;

    try {

      const response = await axios.get(
        `https://www.wanderlog.shop/user/mypage/${userid}/liked-tourists`,
        { withCredentials: true }
      );
      const likedTouristData = response.data;

      setLikedTourists(likedTouristData); // 관광지 데이터 저장
    } catch (err) {

    }
  };

  // 여행 코스 데이터 새로 불러오기 (카테고리 변경 시만)
  const fetchLikedTravelCourses = async () => {
    if (!userid) return;

    try {
      const response = await axios.get(
        `https://www.wanderlog.shop/user/mypage/${userid}/liked-travelcourse`,
        { withCredentials: true }
      );
      const likedTravelcourseData = response.data;
      setLikedTravelCourse(likedTravelcourseData); // 여행 코스 데이터 저장
    } catch (err) {
    }
  };

  // 카테고리 변경 시, 해당 카테고리의 데이터를 불러옴
  useEffect(() => {
    if (category === "tourist") {
      fetchLikedTourists();
    } else if (category === "travelcourse") {
      fetchLikedTravelCourses();
    } else if (category === "plan") {
      fetchLikedPlanners();
    }
  }, [category, userid]);

  return (
    <div className="liked-planner-container">
      <div className="filter-options">
        <button
          className={`plan-btn ${category === "plan" ? "active" : ""}`}
          onClick={() => setCategory("plan")}>
          <img src={courseIcon} />
          여행 계획
        </button>
        <button
          className={`tourist-btn ${category === "tourist" ? "active" : ""}`}
          onClick={() => setCategory("tourist")}>
          <img src={touristIcon} />
          관광지
        </button>
        <button
          className={`travelcourse-btn ${category === "travelcourse" ? "active" : ""}`}
          onClick={() => setCategory("travelcourse")}>
          <img src={travelCourseIcon} />
          여행 코스
        </button>
      </div>

      {category === "plan" && (
        <PlanList
          filteredPlanners={likedPlannersState}
          handlePlannerClick={handlePlannerClick}
          userid={userid}
          removePlanLike={removePlanLike}
        />
      )}
      {category === "tourist" && (
        <TouristList
          setLikedTourists={setLikedTourists}
          likedTourists={likedTourists}
          userid={userid}
        />
      )}
      {category === "travelcourse" && (
        <TravelCourseList
          setLikedTravelCourse={setLikedTravelCourse}
          likedTravelCourse={likedTravelCourse}
          userid={userid}
        />
      )}
    </div>
  );
};

export default LikedPlannerList;
