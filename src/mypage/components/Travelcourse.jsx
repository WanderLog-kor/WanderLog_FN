import React from "react";

const TravelCourseList = ({ likedTravelCourse }) => {
    console.log(likedTravelCourse);

    if (!likedTravelCourse || likedTravelCourse.length === 0) {
      return <p>좋아요한 여행코스가 없습니다</p>;
    }

    return (
        <ul>
          {likedTravelCourse.map((tourist, index) => {
            const item = tourist?.items?.item[0];
            console.log('여행코스 : ',item);
            return (
              <li key={item?.contentid || index} className="planner-item">
                <div className="planner-thumbnail">
                  <img
                    src={item?.firstimage || "/default-image.jpg"}
                    alt={item?.title || "이미지 없음"}
                  />
                </div>
                <div className="planner-info">
                  <p className="planner-title">{item?.title || "이름 없음"}</p>
                  <p>{item?.addr1  || "주소 정보 없음"}</p>
                  <p>{item?.cat1 || ""}</p>
                </div>
              </li>
            );
          })}
        </ul>
      );
};

export default TravelCourseList;
