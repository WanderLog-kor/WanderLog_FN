import { useState, useEffect } from "react";
import axios from "axios";

const useLikePlanner = (userid) => {
  const [likedPlanners, setLikedPlanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // userid 유효성 검사
    if (!userid || userid.trim() === "") {
      setLikedPlanners([]);
      return; // userid가 비어 있다면 API 호출하지 않음
    }

    const fetchLikedPlanners = async () => {
      setLoading(true);
      try {
        // 백엔드 API 호출
        const response = await axios.get(`http://localhost:9000/user/mypage/${userid}/liked-planners`);
        setLikedPlanners(response.data); // API 응답 데이터 저장
      } catch (error) {

      } finally {
        setLoading(false); //로딩 종료
      }
    };

    fetchLikedPlanners();
  }, [userid]);

  return { likedPlanners, loading, error };
};

export default useLikePlanner;
