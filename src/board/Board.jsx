import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Board.scss';
import Footer from '../components/Footer.jsx';
import { useLoginStatus } from "../auth/PrivateRoute.jsx";
import MainSection from "../main/MainSection.jsx";
import Sidebar from "../components/Sidebar.jsx";

const Board = () => {
    const [planners, setPlanners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [totalItems, setTotalItems] = useState(0); // 전체 항목 수 (추가)
    const [selectedArea, setSelectedArea] = useState(""); // 선택된 지역 필터
    const [showMyCoursesOnly, setShowMyCoursesOnly] = useState(false); // 내가 작성한 코스만 보기
    const [activeTab, setActiveTab] = useState("board-userCourse"); // 활성화된 탭 상태 
    const [loading, setLoading] = useState(false); // 데이터 로딩 상태
    const [error, setError] = useState(null); // 오류 메시지
    const [noDataMessage, setNoDataMessage] = useState(""); // 데이터가 없을 때 메시지 상태

    const pageSize = 16; // 한 페이지에 표시할 아이템 수
    const navigate = useNavigate();
    const { loginStatus, loginData } = useLoginStatus();

    const handlePlannerClick = (plannerID) => {
        const plannerItem = planners.find((item) => item.plannerID === plannerID);
        navigate(`destination?plannerID=${plannerID}`, { state: { plannerItem } });
    };

    const fetchPlanners = async (page) => {
        setLoading(true);
        setError(null);
        setNoDataMessage("");

        const query = {
            page: page,
            size: pageSize,
            ...(selectedArea && { area: selectedArea }), // 지역 필터
            ...(showMyCoursesOnly && { myCourses: true, userId: loginData?.userid }), // 내가 작성한 코스만 보기
            ...(!showMyCoursesOnly && { isPublic: 1 }), // 공개된 코스만 보기
        };

        try {
            const response = await axios.get(`http://localhost:9000/planner/board`, { params: query });
            const fetchedPlanners = response.data.content;
            console.log('데이터 : ', fetchedPlanners);
            console.log('loginStatus : ', loginStatus);
            console.log('로그인데이터', loginData);

            // 지역에 맞는 데이터가 없으면 메시지 설정
            if (fetchedPlanners.length === 0) {
                setNoDataMessage("해당 지역에 대한 코스가 없습니다.");
            } else {
                setPlanners((prev) => (page === 1 ? fetchedPlanners : [...prev, ...fetchedPlanners]));
                setTotalPages(response.data.totalPages); // 전체 페이지 수 업데이트
                setTotalItems(response.data.totalElements); // 전체 항목 수 업데이트 (추가)
            }
        } catch (err) {
            setError("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };
    

    const handleMoreClick = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchPlanners(nextPage);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab); // 활성화된 탭 업데이트
        setPlanners([]); // 필터 변경 시 데이터 초기화
        setCurrentPage(1); // 페이지 초기화

        if (tab === "board-myCourse") {
            setShowMyCoursesOnly(true); // 내가 작성한 코스만 보기
        } else {
            setShowMyCoursesOnly(false); // 모든 코스 보기
        }
    };

    useEffect(() => {
        if (activeTab === "board-myCourse" && !loginStatus) {
            setPlanners([]); // 로그인하지 않았으므로 코스 목록 초기화
            setTotalPages(1); // 페이지 수 초기화
            setTotalItems(0); // 전체 항목 수 초기화
            return;
        }
        fetchPlanners(1);
    }, [selectedArea, showMyCoursesOnly, activeTab, loginStatus]);

    return (
        <>
            <div className="board">
                <MainSection />
                <Sidebar />
                <div className="board-wrapper">

                    {/* 탭 영역 */}
                    <div className="board-tap">
                        <ul>
                            <li
                                className={`board-myCourse ${activeTab === "board-myCourse" ? "on" : ""}`}
                                onClick={() => handleTabClick("board-myCourse")}
                                style={activeTab === "board-myCourse" ? { pointerEvents: "none"} : {}}>
                                <span>내가 작성한 여행코스</span>
                            </li>
                            <li
                                className={`board-userCourse ${activeTab === "board-userCourse" ? "on" : ""}`}
                                onClick={() => handleTabClick("board-userCourse")}
                                style={activeTab === "board-userCourse" ? { pointerEvents: "none"} : {}}>
                                <span>다른 사용자의 여행코스</span>
                            </li>
                        </ul>
                    </div>

                    <div className="board-top">
                        <h1 className="board-title">
                            {activeTab === "board-myCourse" ? "내가 작성한 여행 코스를 확인해 보세요!" : "다른 유저의 여행 계획을 확인해 보세요!"}
                        </h1>
                        
                        {/* 필터 영역 */}
                        {activeTab === "board-userCourse" && (
                            <div className="selectBox">
                                <select
                                    className="select"
                                    value={selectedArea}
                                    onChange={(e) => setSelectedArea(e.target.value)}
                                >
                                    <option value="">전체</option>
                                    <option value="서울">서울</option> {/* 이거 도시 이름 줄여서 써야 조회됨. DB에 그렇게 저장돼서 그런듯 */}
                                    <option value="부산광역시">부산</option>
                                    <option value="대구광역시">대구</option>
                                    <option value="인천광역시">인천</option>
                                    <option value="광주광역시">광주</option>
                                    <option value="대전광역시">대전</option>
                                    <option value="울산광역시">울산</option>
                                    <option value="세종특별자치시">세종</option>
                                    <option value="경기도">경기도</option>
                                    <option value="강원도">강원도</option>
                                    <option value="충청북도">충청북도</option>
                                    <option value="충청남도">충청남도</option>
                                    <option value="전라북도">전라북도</option>
                                    <option value="전라남도">전라남도</option>
                                    <option value="경상북도">경상북도</option>
                                    <option value="경상남도">경상남도</option>
                                    <option value="제주특별자치도">제주</option>
                                </select>
                            </div>
                        )}

                    </div>

                    {/* 플래너 내용 */}
                    <div className="planner-content">
                        {loading ? (
                            <p className="loading">로딩 중...</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : noDataMessage ? (
                            <p className="noData">{noDataMessage}</p> // 데이터가 없으면 메시지 출력
                        ) : planners.length === 0 ? (
                            <p className="noCourse">
                                {activeTab === "board-myCourse" && !loginStatus && "아직 제작한 코스가 없습니다."}
                            </p>
                        ) : (
                            planners.map((planner) => (
                                <div
                                    key={planner.plannerID}
                                    className="planner-item"
                                    onClick={() => handlePlannerClick(planner.plannerID)} >
                                    <div className="planner-image-section">
                                        <div className="planner-thumbnail">
                                            <img src={planner.thumbnailImage} alt="플래너 썸네일" />
                                        </div>
                                        <div className="planner-profile">
                                            <img src={planner.userProfileImg}></img>
                                        </div>
                                    </div>
                                    <div className="planner-info">
                                        <p className="planner-duration">
                                            {planner.day === 1
                                                ? "당일"
                                                : `${planner.day - 1}박 ${planner.day}일`}
                                        </p>
                                        <h3 className="planner-title">{planner.plannerTitle}</h3>
                                        <p className="planner-area">{planner.area}</p>
                                        <p className="planner-created-at">작성일 {new Date(planner.createAt).toLocaleDateString()}</p>
                                        <div className="planner-like-count">
                                            <span className="material-symbols-outlined like-icon">
                                                favorite
                                            </span>
                                            <span className="like-number">{planner.likeCount}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 더보기 버튼 */}
                    {!loading && !error && !noDataMessage && planners.length > 0 && currentPage < totalPages && (
                        <div className="board-pagination">
                            <button onClick={handleMoreClick}>더보기 +</button>
                            <p className="pagination-info">
                                {planners.length} / {totalItems}개 항목
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Board;
