import "./PlanList.scss";


const PlanList = ({ filteredPlanners, handlePlannerClick }) => {

  return (
    <ul>
      {filteredPlanners.length === 0 ? (
        <p>좋아요 한 여행계획이 없습니다.</p>
      ) : (
        filteredPlanners.map((likePlan, index) => (
          <li
            key={likePlan.plannerId || index}
            className="planner-item"
            onClick={() => handlePlannerClick(likePlan.plannerID)} //여기 plannerID 에 ID 대문자로 해야함
          >
            <div className="planner-thumbnail">
              <img
                src={likePlan.destinations?.[0]?.image || Image}
                alt="없으"
              />
            </div>
            <div className="planner-desription">
              <p>지역: {likePlan.area}</p>
              <h2>{likePlan.plannerTitle}</h2>
              <p>여행 일수: {likePlan.day}일</p>
              <p>여행 일정 : {likePlan.startDate} ~ {likePlan.endDate}</p>

              <p>설명: {likePlan.description}</p>
              <p>생성 날짜: {likePlan.createAt.split('T')[0]}</p>

            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default PlanList;