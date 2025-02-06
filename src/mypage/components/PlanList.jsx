import React, { useState, useEffect } from "react";

const PlanList = ({ filteredPlanners, handlePlannerClick, removePlanLike, userid }) => {
  const ITEMS_PER_PAGE = 6; // 한 번에 표시할 아이템 개수
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE); // 현재 표시 중인 개수
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    console.log('filteredPlanners : ', filteredPlanners);
    if (filteredPlanners.length > 0) {
      setLoading(false);
    } else {
      setLoading(false); // 빈 배열일 경우에도 로딩 상태 끝내기
    }
  }, [filteredPlanners]);

  // 더보기 버튼 클릭 시 ITEMS_PER_PAGE만큼 더 로드
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div>
      {loading && <p className="loading-text">로딩 중...</p>} {/* 로딩 상태 표시 */}

      <ul>
        {filteredPlanners.length === 0 ? (
          <p>좋아요한 여행계획이 없습니다.</p> // 데이터가 없을 때 메시지
        ) : (
          filteredPlanners.slice(0, visibleCount).map((likePlan, index) => (
            <li
              key={likePlan.plannerID || index}
              className="planner-item"
            >
              <div className="planner-thumbnail" onClick={() => handlePlannerClick(likePlan.plannerID)}>
                <img
                  src={likePlan.destinations?.[0]?.image || "/default-image.jpg"}
                  alt="여행 이미지"
                />
              </div>
              <div className="planner-info">
                <p className="planner-duration">
                  {likePlan.startDate} ~ {likePlan.endDate}
                </p>
                <h2 className="planner-title">{likePlan.plannerTitle}</h2>
                <p className="planner-area">{likePlan.area}</p>
                <p className="planner-created-at">
                  생성 날짜: {likePlan.createAt.split("T")[0]}
                </p>
              </div>

              <div className="like-btn-container">
                <button
                  className="like-button liked"
                  onClick={() => removePlanLike(likePlan.plannerID)} // 좋아요 취소 클릭 시 함수 호출
                >
                  좋아요 취소
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* "더보기" 버튼 (더 이상 보여줄 항목이 없으면 숨김) */}
      {visibleCount < filteredPlanners.length && (
        <div className="mypage-pagination">
          <button onClick={handleLoadMore} className="load-more-btn">
            더보기
          </button>
          <p className="pagination-info">
            {visibleCount} / {filteredPlanners.length}개 항목
          </p>
        </div>
      )}
    </div>
  );
};

export default PlanList;
