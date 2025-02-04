import { useEffect, useState } from "react";
import "../components/LikedPlannerList.scss";
import axios from "axios";
import useLikePlanner from "../useLikePlanner";
import PlanList from "./PlanList";
import TouristList from "./Tourist";
import TravelCourseList from "./Travelcourse";

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
      //   console.log("받아온 여행코스 ID 목록:", likedTravelcourseData);

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
      {
        console.log(category);
      }

    }
  });


  return (
    <div className="liked-planner-container">
      <div className="filter-options">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="plan">여행 계획</option>
          <option value="tourist">관광지</option>
          <option value="travelcourse">여행 코스</option>
        </select>
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
