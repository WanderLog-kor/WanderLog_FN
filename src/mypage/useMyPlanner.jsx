import { useState, useEffect } from "react";
import axios from "axios";

const useMyPlanner = (detailProfile) => {
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlanners = async () => {
    try {
      setLoading(true);
  
      const response = await axios.get(
        "https://www.wanderlog.shop/user/mypage/my-planners",
        {
          withCredentials: true,
        }
      );
  for(let i=0;i<response.data.length;i++){
  }
      setPlanners(response.data);
      setError(null); // 에러 초기화
    } catch (err) {
      console.error("플래너 데이터를 가져오는 중 오류:", err.response || err);
      setError("플래너 데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };
  

  useEffect(() => {
    if(!detailProfile){
      fetchPlanners();
    }
  }, [detailProfile]);

  return { planners, loading, error };
};

export default useMyPlanner;
