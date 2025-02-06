
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const TravelCourseList = ({ likedTourists, userid, setLikedTourists }) => {
  const ITEMS_PER_PAGE = 6; // 한 번에 표시할 아이템 개수
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    if (likedTourists && likedTourists.length > 0) {
      setLoading(false); // 데이터가 로드되었으면 로딩 끝
    } else {
      setLoading(false); // 데이터가 비어있으면 로딩 상태 유지
    }
  }, [likedTourists]); // likedTourists 값이 변경될 때마다 실행

  // 좋아요 취소 시 해당 항목을 리스트에서 제거하고 데이터를 다시 불러오기
  const removeLike = (touristId) => {
    const isConfirmed = window.confirm("좋아요를 취소하시겠습니까?");

    if (isConfirmed) {
      // 좋아요 취소 API 요청
      axios.post(
        `http://localhost:9000/tourist/toggleLike`,
        { touristId, userId: userid },
        { withCredentials: true }
      )
        .then(() => {
          // 좋아요 취소 후, 새롭게 데이터 요청하여 리스트 갱신
          setLoading(true);
          fetchLikedTourists();
        })
        .catch((error) => {
          console.error('Error removing like:', error);
        });
    }
  };

  // 데이터를 새로 가져오는 함수
  const fetchLikedTourists = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/user/mypage/${userid}/liked-tourists`,
        { withCredentials: true }
      );
      const likedTouristData = response.data;
      setLikedTourists(likedTouristData); // 부모 컴포넌트의 상태 업데이트
      setLoading(false)
    } catch {
      setLoading(false)
    }

  };
  // 관광지 클릭시 상세 페이지로 데이터 전달
  const handleTouristClick = (contentId) => {
    navigate(`/tourist-info?contentId=${contentId}`);
  };

  // 데이터가 없으면 기본 메시지 출력
  if (loading) {
    return <p>로딩 중...</p>; // 데이터가 아직 로딩 중이면 로딩 중 메시지 출력
  }

  if (!likedTourists || likedTourists.length === 0) {
    return <p>좋아요한 관광지가 없습니다.</p>;
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE); // 데이터 더 로드
  };

  return (
    <div className="mypage-tourist-like-content">
      <ul>
        {likedTourists.slice(0, visibleCount).map((tourist, index) => {
          const item = tourist?.items?.item?.[0];
          return (
            <li key={item?.contentid || index} className="planner-item">
              <div className="planner-thumbnail" onClick={() => handleTouristClick(item.contentid)} >
                <img
                  src={item?.firstimage || "/default-image.jpg"}
                  alt={item?.title || "이미지 없음"}
                />
              </div>
              <div className="planner-info">
                <p className="planner-title">{item?.title || "이름 없음"}</p>
                <p>{item?.addr1 || "주소 정보 없음"}</p>
                <p>{item?.cat1 || ""}</p>
              </div>

              <div className="mypage-like-btn-container">
                <button
                  className="like-button liked"
                  onClick={() => removeLike(item?.contentid)}>
                  좋아요 취소
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* 더보기 버튼 (더 이상 보여줄 항목이 없으면 숨김) */}
      {visibleCount < likedTourists.length && (
        <div className="mypage-pagination">
          <button onClick={handleLoadMore} className="load-more-btn">
            더보기
          </button>
          <p className="pagination-info">{visibleCount} / {likedTourists.length}개 항목</p>
        </div>
      )}
    </div>
  );
};

export default TravelCourseList;

