import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TravelCourse.scss';
import touristJson from './jsonFile/tourist.json';
import { useLoginStatus } from '../auth/PrivateRoute';
import Footer from '../components/Footer';
import MainSection from '../main/MainSection';
import Submenu from '../components/SubMenu';
import travelCourseImg from '../components/iconImage/travel-guide.png';
import Sidebar from '../components/Sidebar';

const TravelCourse = () => {
    // 관광지 코스 검색이기 때문에 값 고정
    const contentTypeId = 25;
    const pageSize = 10;  // 페이지당 항목 수
    const [hashtagFilter, setHashtagFilter] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [arrange, setArrange] = useState('O');
    const [showCategory, setShowCategory] = useState(false); // 카테고리 드롭다운 상태
    const [showRegion, setShowRegion] = useState(true); // 지역 드롭다운 상태
    const [showAllCategories, setShowAllCategories] = useState(false); // 카테고리 더보기
    const [showAllRegions, setShowAllRegions] = useState(false); // 지역 더보기
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [likedStatus, setLikedStatus] = useState({});  // 각 관광지별 좋아요 상태 관리
    const { loginStatus } = useLoginStatus();
    const navigate = useNavigate();

    // 지역
    const regionOptions = Object.entries(touristJson.regions).map(([code, label]) => ({
        value: code,
        label: label,
    }));

    // 카테고리
    const categoryOptions = [
        { value: 'C0112', label: '#가족코스' },
        { value: 'C0113', label: '#나홀로코스' },
        { value: 'C0114', label: '#힐링코스' },
        { value: 'C0115', label: '#도보코스' },
        { value: 'C0116', label: '#캠핑코스' },
        { value: 'C0117', label: '#맛코스' },
    ];

    // 검색어를 URL 인코딩하는 함수
    const encodeUTF8 = () => {
        return encodeURIComponent(searchKeyword.trim());
    };

    // 여행 코스 검색 함수
    const handleSearch = () => {
        setLoading(true); // 검색 시작 시 로딩 상태 true로 설정
        const currentEncodedData = encodeUTF8();
        const data = {
            keyword: currentEncodedData,
            pageNo: currentPage,
            hashtag: hashtagFilter,
            regionCode: regionFilter,
            arrange: arrange,
            contentTypeId: contentTypeId
        };

        axios.post('https://www.wanderlog.shop/api/getSearch', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                setCourseData(response.data.items.item || []); // 빈 배열로 안전하게 설정
                setTotalCount(response.data.totalCount);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
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

    // 페이지네이션 버튼 생성 함수
    const createPageButtons = (totalPages) => {
        const maxVisibleButtons = 5; // 한 번에 보이는 최대 버튼 수
        const currentBlock = Math.floor((currentPage - 1) / maxVisibleButtons); // 현재 블록 계산
        const startPage = currentBlock * maxVisibleButtons + 1; // 현재 블록의 시작 페이지
        const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages); // 현재 블록의 마지막 페이지

        const buttons = [];

        // '처음' 버튼
        if (currentPage > 1) {
            buttons.push(
                <button key="first" onClick={() => handlePageChange(1)}>처음</button>
            );
        }

        // '이전' 버튼
        if (currentBlock > 0) {
            buttons.push(
                <button key="prev" onClick={() => handlePageChange(startPage - 1)}>이전</button>
            );
        }

        // 현재 블록 기준으로 버튼 생성
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={i === currentPage ? 'active' : ''}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        // '다음' 버튼
        if (endPage < totalPages) {
            buttons.push(
                <button key="next" onClick={() => handlePageChange(endPage + 1)}>다음</button>
            );
        }

        // '끝' 버튼
        if (currentPage < totalPages) {
            buttons.push(
                <button key="last" onClick={() => handlePageChange(totalPages)}>끝</button>
            );
        }

        return buttons;
    };

    // 페이지 버튼 누를 시 페이지 변경 처리 함수 (axios 다시 요청)
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);  // 페이지 상태 변경
    };

    // 필터 클릭
    const handleFilterClick = (filterType, value) => {
        if (filterType === 'region') {
            setRegionFilter(value); // 지역 필터 상태 변경
            setCurrentPage(1); // 페이지를 초기화
        }
        if (filterType === 'category') {
            setCategoryFilter(value); // 카테고리 필터 상태 변경
            setCurrentPage(1); // 페이지를 초기화
        }
    };

    // 정렬 클릭
    const handleArrangeClick = (value) => {
        setArrange(value);
    };

    // 정렬 드롭다운 
    const handleDropdownToggle = () => {
        setDropdownOpen((prev) => !prev);
    };

    // 버튼의 텍스트는 arrange 상태에 따라 동적으로 변경
    const getButtonText = () => {
        switch (arrange) {
            case 'O':
                return '제목순';
            case 'Q':
                return '수정일순';
            case 'R':
                return '생성일순';
            default:
                return '정렬';
        }
    };


    // 한 페이지에 10개씩 표시
    const totalPages = totalCount ? Math.ceil(totalCount / 20) : 0;
    // 좋아요 버튼 누를 시
    const toggleLike = (e, touristId) => {
        e.stopPropagation();

        // 로그인 하지 않고 좋아요 버튼 누르면 로그인 해야한다고 알림
        if (!loginStatus || loginStatus === '') {
            alert("로그인이 필요합니다!");
            return;
        }

        const likeRequest = {
            touristId: touristId,
            userId: loginStatus.userid
        };

        axios.post('https://www.wanderlog.shop/tourist/toggleLike', likeRequest, {
            headers: {
                'Content-Type': 'application/json', // JSON 포맷으로 전송
            },
            withCredentials: true,
        })
            .then(response => {
                setLikedStatus(prevState => ({
                    ...prevState,
                    [touristId]: !prevState[touristId], // 좋아요 상태 토글
                }));
            })

    };

    // 좋아요 상태 가져오기
    const getLikeStatus = (touristId) => {
        if (loginStatus && loginStatus.userid) {  // 로그인 상태가 있을 때만 호출
            axios.get(`https://www.wanderlog.shop/tourist/likeStatus?touristId=${touristId}&userId=${loginStatus.userid}`, {
                withCredentials: true,
            })
                .then(response => {
                    setLikedStatus(prevState => ({
                        ...prevState,
                        [touristId]: response.data, // 응답 데이터 그대로 사용 (boolean 상태일 경우)
                    }));
                })
        }
    };
    useEffect(() => {
        handleSearch();
    }, [currentPage, arrange, regionFilter, categoryFilter, loginStatus]);

    useEffect(() => {
        if (loginStatus && loginStatus.userid && courseData.length > 0) {
            courseData.forEach((course) => {
                getLikeStatus(course.contentid);
            });
        }
    }, [courseData, loginStatus]);

    return (

        <>

            <MainSection />
            <Submenu />
            <Sidebar />
            
            <div className="tourist-wrapper">

                <div className="tourist-category">
                <h2 className="tourist-title">여행코스
                        <img src={travelCourseImg}></img>
                    </h2>

                    {/* 지역 필터 */}
                    <div className="region-filter">
                        <p onClick={() => setShowRegion((prev) => !prev)}>
                            지역
                            <span className={`dropdown-arrow ${showRegion ? 'open-arrow' : ''}`}></span>
                        </p>
                        {showRegion && (
                            <ul className="filter-list">
                                <li
                                    className={`filter-item ${regionFilter === '' ? 'active' : ''}`}
                                    onClick={() => handleFilterClick('region', '')} >
                                    전체
                                </li>
                                {(showAllRegions ? regionOptions : regionOptions.slice(0, 10)).map((option) => (
                                    <li
                                        key={option.value}
                                        className={`filter-item ${regionFilter === option.value ? 'active' : ''}`}
                                        onClick={() => handleFilterClick('region', option.value)}>
                                        {option.label}
                                    </li>
                                ))}
                                {regionOptions.length > 10 && (
                                    <button
                                        className="more-button"
                                        onClick={() => setShowAllRegions((prev) => !prev)}>
                                        {showAllRegions ? '접기' : '더보기'}

                                        <span className={`dropdown-arrow ${showAllRegions ? 'open-arrow' : ''}`}></span>
                                    </button>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="category-filter">
                        {/* 카테고리 필터 */}
                        <p onClick={() => setShowCategory((prev) => !prev)}>
                            카테고리
                            <span className={`dropdown-arrow ${showCategory ? 'open-arrow' : ''}`}></span>
                        </p>
                        {showCategory && (
                            <ul className="filter-list">
                                <li
                                    className={`filter-item ${categoryFilter === '' ? 'active' : ''}`}
                                    onClick={() => handleFilterClick('category', '')}
                                >
                                    전체
                                </li>
                                {(showAllCategories ? categoryOptions : categoryOptions.slice(0, 10)).map((option) => (
                                    <li
                                        key={option.value}
                                        className={`filter-item ${categoryFilter === option.value ? 'active' : ''}`}
                                        onClick={() => handleFilterClick('category', option.value)}
                                    >
                                        {option.label}
                                    </li>
                                ))}
                                {categoryOptions.length > 10 && (
                                    <button
                                        className="more-button"
                                        onClick={() => setShowAllCategories((prev) => !prev)}>
                                        {showAllCategories ? '접기' : '더보기'}
                                        <span className={`dropdown-arrow ${showAllCategories ? 'open-arrow' : ''}`}></span>
                                    </button>
                                )}
                            </ul>
                        )}
                    </div>
                </div>


                <div className="tourist-content">
                    <div className="tourist-header">
                        {/* 검색어 입력 */}
                        <div className="tourist-search">
                            <input
                                type="text"
                                placeholder="관광지 검색"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="tourist-search-input" />
                            <button onClick={handleSearch} className="tourist-search-button"></button>
                        </div>

                        <div className="sort-dropdown">
                            <button
                                className={`dropdown-button ${dropdownOpen ? 'open' : ''}`}
                                onClick={handleDropdownToggle}>
                                {getButtonText()}
                                <span className="dropdown-arrow"></span>
                            </button>
                            <ul className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                                <li
                                    className={`dropdown-item ${arrange === 'O' ? 'active' : ''}`}
                                    onClick={() => {
                                        handleArrangeClick('O');
                                        setDropdownOpen(false);
                                    }}>
                                    제목순
                                </li>
                                <li
                                    className={`dropdown-item ${arrange === 'Q' ? 'active' : ''}`}
                                    onClick={() => {
                                        handleArrangeClick('Q');
                                        setDropdownOpen(false);
                                    }}>
                                    수정일순
                                </li>
                                <li
                                    className={`dropdown-item ${arrange === 'R' ? 'active' : ''}`}
                                    onClick={() => {
                                        handleArrangeClick('R');
                                        setDropdownOpen(false);
                                    }}>
                                    생성일순
                                </li>
                            </ul>
                        </div>
                    </div>


                    <div>
                        {loading ? (
                            <div className="loading-message">로딩 중...</div>
                        ) : (

                            <div className="tourist-info">
                                {courseData.map((tourist) => {
                                    const { contentid, title, firstimage, areacode } = tourist;
                                    const regionName = touristJson.regions[areacode] || "";
                                    return (
                                        <div key={contentid} title={title} className="tourist-card" style={{ '--image-url': `url(${firstimage})` }} onClick={() => handleCourseClick(tourist.contentid)}>
                                            {firstimage && (
                                                <img
                                                    src={firstimage}
                                                    alt={title}
                                                    className="tourist-img"
                                                />
                                            )}
                                            <h4 className="tourist-title">{title}</h4>
                                            <div className="tourist-box">
                                                <p className="tourist-region">{regionName}</p>

                                                {/* 좋아요 버튼 */}
                                                <button
                                                    className={`like-button ${likedStatus[contentid] ? 'liked' : 'not-liked'}`}
                                                    onClick={(e) => toggleLike(e, contentid)}
                                                >
                                                    {/* 배경 이미지를 사용하여 좋아요 상태에 따라 변경 */}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>


                    <div className="tourist-footer">
                        <p className="total-count">총 {totalCount}개 코스</p>

                        <div className="tourist-pagination">

                            {totalPages > 0 && createPageButtons(totalPages)}
                        </div>

                        {totalPages > 0 && (
                            <p className="page-info">{currentPage} / {totalPages} 페이지</p>
                        )}
                    </div>
                </div>

            </div >
            <Footer />
        </>

    );
};

export default TravelCourse;
