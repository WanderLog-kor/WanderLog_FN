import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 6; // 한 번에 표시할 아이템 개수

const TravelCourseList = ({ likedTravelCourse, userid, setLikedTravelCourse }) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE); // 현재 표시 중인 개수
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate();

  // likedTravelCourse가 업데이트 될 때 로딩 상태 변경
  useEffect(() => {
    if (likedTravelCourse && likedTravelCourse.length > 0) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [likedTravelCourse]);

  // 좋아요 취소 후 데이터를 다시 요청하고 갱신하는 함수
  const fetchLikedTravelCourses = async () => {
    try {
      const response = await axios.get(
        `https://www.wanderlog.shop/user/mypage/${userid}/liked-travelcourse`,
        { withCredentials: true }
      );
      const likedTravelcourseData = response.data;
      setLikedTravelCourse(likedTravelcourseData); // 부모 컴포넌트의 상태 업데이트
      setLoading(false); // 로딩 완료
    } catch (error) {
    }
  };

  // 좋아요 취소 시 해당 항목을 리스트에서 제거하고 데이터를 다시 불러오기
  const removeLike = (travelCourseId) => {
    const isConfirmed = window.confirm("좋아요를 취소하시겠습니까?");
    if (isConfirmed) {
      // 좋아요 취소 API 요청
      axios.post(
        `https://www.wanderlog.shop/travelCourse/toggleLike`,
        { travelCourseId, userId: userid },
        { withCredentials: true }
      )
        .then(() => {
          // 좋아요 취소 후, 새롭게 데이터 요청하여 리스트 갱신
          setLoading(true);
          fetchLikedTravelCourses();
        })
        .catch((error) => {

        });
    }
  };

  if (loading) {
    return <p>로딩 중...</p>; // 로딩 중일 때 표시
  }

  if (!likedTravelCourse || likedTravelCourse.length === 0) {
    return <p>좋아요한 여행코스가 없습니다.</p>;
  }

  // 더보기 버튼 클릭 시 ITEMS_PER_PAGE만큼 더 로드
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };
  // 여행 코스 클릭시 상세 페이지로 데이터 전달
  const handleCourseClick = (contentId, hashtag) => {
    setLoading(true); // 로딩 시작

    navigate(`/travelcourse-info?contentId=${contentId}`, {
      state: {
        hashtag,
      },
    });
  };

  return (
    <div className="mypage-travelCourse-like-content">
      <ul>
        {likedTravelCourse.slice(0, visibleCount).map((tourist, index) => {
          const item = tourist?.items?.item[0];
          return (
            <li key={item?.contentid || index} className="planner-item" >
        <div className="planner-thumbnail" onClick = {() => handleCourseClick(item.contentid)}>
          <img
            src={item?.firstimage || "/default-image.jpg"}
            alt={item?.title || "이미지 없음"}
          />
        </div>
        <div className="planner-info">
          <p className="planner-title">{item?.title || "이름 없음"}</p>
          <p>{item?.addr1 || ""}</p>
          <p>{item?.cat1 || ""}</p>
        </div>

        <div className="mypage-like-btn-container">
          <button
            className="like-button liked"
            onClick={() => removeLike(item?.contentid)}
          >
            좋아요 취소
          </button>
        </div>
      </li>
      );
        })}
    </ul>

      {
    visibleCount < likedTravelCourse.length && (
      <div className="mypage-pagination">
        <button onClick={handleLoadMore} className="load-more-btn">
          더보기
        </button>
        <p className="pagination-info">{visibleCount} / {likedTravelCourse.length}개 항목</p>
      </div>
    )
  }
    </div >
  );
};

export default TravelCourseList;
