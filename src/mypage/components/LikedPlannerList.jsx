import { useEffect, useState } from "react";
import axios from "axios";
import PlanList from "./PlanList";
import TouristList from "./Tourist";
import TravelCourseList from "./Travelcourse";

import touristIcon from './images/tourist-attraction.png';
import travelCourseIcon from './images/travel-guide.png';
import courseIcon from './images/itinerary.png';

const LikedPlannerList = ({ likedPlanners, handlePlannerClick, userid }) => {
  const [category, setCategory] = useState("plan"); //카테고리 필터 상태 변수 ,, 기본적으로 여행 계획 먼저나옴
  const [likedTourists, setLikedTourists] = useState([]);
  const [likedTravelCourse, setLikedTravelCourse] = useState([]);

  //각 카테고리를 선택할 때 결과가 다르게 나옴
  const filteredPlanners = likedPlanners.filter((planner) => {
    if (category === "plan") return true;
    if (category === "tourist") return false;
    if (category === "travelcourse") return false;
    return true;
  });

  //관광지 데이터 받아옴
  const fetchLikedTourists = async () => {
    if (!userid) return;

    try {
      console.log("관광지 데이터를 불러옵니다.");
      const response = await axios.get(
        `http://localhost:9000/user/mypage/${userid}/liked-tourists`,
        { withCredentials: true }
      );

      const likedTouristData = response.data;
      console.log("받아온 관광지 ID 목록:", likedTouristData);

      setLikedTourists(likedTouristData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (category === "tourist") {
      fetchLikedTourists();
    }
  }, [category, userid]);

  //여행코스 데이터 받아옴
  const fetchLikedTravelCourses = async () => {
    if (!userid) return;

    try {
      console.log("여행코스 데이터를 불러옵니다.");
      const response = await axios.get(
        `http://localhost:9000/user/mypage/${userid}/liked-travelcourse`,
        { withCredentials: true }
      );

      const likedTravelcourseData = response.data;
      setLikedTravelCourse(likedTravelcourseData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (category === "travelcourse") {
      fetchLikedTravelCourses();
    }
  }, [category, userid]);

  useEffect(() => {
    if (category === "plan") {
      console.log(category);
    }
  });

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
          className={`tourist-btn ${ category === "tourist" ? "active" : ""}`}
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
          filteredPlanners={likedPlanners}
          handlePlannerClick={handlePlannerClick}
        />
      )}
      {category === "tourist" && (
        <TouristList likedTourists={likedTourists} />
      )}
      {category === "travelcourse" && (
        <TravelCourseList likedTravelCourse={likedTravelCourse} />
      )}
    </div>
  );
};

export default LikedPlannerList;
