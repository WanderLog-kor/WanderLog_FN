import React from "react";
import "./Travelcourse.scss";

const TravelCourseList = ({ likedTravelCourse }) => {
    console.log(likedTravelCourse);

    if (!likedTravelCourse || likedTravelCourse.length === 0) {
      return <p>좋아요한 여행코스가 없습니다</p>;
    }

    return (
        <ul>
          {likedTravelCourse.map((tourist, index) => {
            const item = tourist?.items?.item[0];
            console.log(item);
            return (
              <li key={item?.contentid || index} className="planner-item">
                <div className="planner-thumbnail">
                  <img
                    src={item?.firstimage || "/default-image.jpg"}
                    alt={item?.title || "이미지 없음"}
                  />
                </div>
                <div className="planner-description">
                  <p>이름: {item?.title || "이름 없음"}</p>
                  <p>주소: {item?.addr1  || "주소 없음"}</p>
                  <p>카테고리: {item?.cat1 || "카테고리 없음"}</p>
                </div>
              </li>
            );
          })}
        </ul>
      );
};

export default TravelCourseList;
