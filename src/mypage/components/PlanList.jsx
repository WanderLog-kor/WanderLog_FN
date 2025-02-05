

const PlanList = ({ filteredPlanners, handlePlannerClick }) => {

  return (
    <ul>
      {filteredPlanners.length === 0 ? (
        <p>선택한 카테고리에 해당하는 관심목록이 없습니다.</p>
      ) : (
        filteredPlanners.map((likePlan, index) => (
          <li
            key={likePlan.plannerId || index}
            className="planner-item"
            onClick={() => handlePlannerClick(likePlan.plannerId)}
          >
            <div className="planner-thumbnail">
              <img
                src={likePlan.destinations?.[0]?.image || Image}
                alt="없으"
              />
            </div>
            <div className="planner-info">
              <p className="planner-duration">{likePlan.startDate} ~ {likePlan.endDate}</p>
              <h2 className="planner-title">{likePlan.plannerTitle}</h2>
              <p className="planner-area">{likePlan.area}</p>
              <p className="planner-created-at">생성 날짜: {likePlan.createAt.split('T')[0]}</p>

            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default PlanList;