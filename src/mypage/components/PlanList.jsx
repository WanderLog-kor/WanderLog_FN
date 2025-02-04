import "./PlanList.scss";


const PlanList = ({filteredPlanners,handlePlannerClick}) => {

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
              <div className="planner-desription">
                <p>지역: {likePlan.area}</p>
                <h2>{likePlan.plannerTitle}</h2>
                <p>여행 일수: {likePlan.day}일</p>
                <p>설명: {likePlan.description}</p>
                <p>생성 날짜: {likePlan.createAt}</p>
                <p>수정 날짜: {likePlan.updateAt}</p>
                <p>출발일: {likePlan.startDate}</p>
                <p>도착일: {likePlan.endDate}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    );
};

export default PlanList;