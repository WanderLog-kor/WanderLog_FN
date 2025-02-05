import React from "react";

const TouristList = ({ likedTourists }) => {
  console.log(likedTourists);

  if (!likedTourists || likedTourists.length === 0) {
    return <p>좋아요한 관광지가 없습니다</p>;
  }

  return (
    <ul>
      {likedTourists.map((tourist, index) => {
        const item = tourist?.items?.item[0];
        console.log('관광지아이템 : ',item);
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
              <p>{item?.addr1  || "주소 없음"}</p>

            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TouristList;
