

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './TravelCourseSection.scss';

// Swiper 모듈
import { Navigation, Pagination } from 'swiper/modules';

const TravelCourseSection = () => {
    const regionMap = {
        "1": "서울",
        "2": "인천",
        "3": "대전",
        "4": "대구",
        "5": "광주",
        "6": "부산",
        "7": "울산",
        "8": "세종",
        "31": "경기",
        "32": "강원",
        "33": "충북",
        "34": "충남",
        "35": "경북",
        "36": "경남",
        "37": "전북",
        "38": "전남",
        "39": "제주"
    };

    // 해시태그를 반환하는 함수
    function getHashtag(category) {
        switch (category) {
            case 'C0112': return '#가족코스';
            case 'C0113': return '#나홀로코스';
            case 'C0114': return '#힐링코스';
            case 'C0115': return '#도보코스';
            case 'C0116': return '#캠핑코스';
            case 'C0117': return '#맛코스';
            default: return '#추천코스';
        }
    }

    const [courseData, setCourseData] = useState([]);
    const [likedStatus, setLikedStatus] = useState({});  // 좋아요 상태
    const [loginStatus, setLoginStatus] = useState('');  // 로그인 상태
    const navigate = useNavigate();
    const swiperRef = useRef(null);

    // 로그인 상태 확인
    useEffect(() => {
        axios.post('http://localhost:9000/api/cookie/validate', {}, { withCredentials: true })
            .then(response => {
                setLoginStatus(response.data);
            })
            .catch(error => {
                setLoginStatus('');
            });
    }, []);

    // 여행 코스 검색 함수
    const handleSearch = () => {
        const data = {
            keyword: '',
            regionCode: '',
            hashtag: '',
            pageNo: 1,
            arrange: 'O',
            contentTypeId: '25',
            numOfRows: 10
        };

        axios.post('http://localhost:9000/api/getSearch', data, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                setCourseData(response.data.items.item || []);
                console.log('여행코스데이터 : ', response.data.items.item)
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    };

    // 좋아요 상태 가져오기
    const getLikeStatus = (travelCourseId) => {
        if (loginStatus && loginStatus.userid) {  // 로그인 상태일 때만 호출
            axios.get(`http://localhost:9000/travelCourse/likeStatus?travelCourseId=${travelCourseId}&userId=${loginStatus.userid}`, {
                withCredentials: true,
            })
                .then(response => {
                    setLikedStatus(prevState => ({
                        ...prevState,
                        [travelCourseId]: response.data, // 응답 데이터 그대로 사용 (boolean 상태일 경우)
                    }));
                })
                .catch(error => {
                    console.error('Error fetching like status:', error);
                });
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        if (loginStatus && loginStatus.userid) {
            courseData.forEach(course => {
                getLikeStatus(course.contentid);
            });
        }
    }, [loginStatus, courseData]);

    // 좋아요 상태 토글 함수
    const toggleLike = (e, travelCourseId) => {
        e.stopPropagation();

        if (!loginStatus || loginStatus === '') {
            alert("로그인이 필요합니다!");
            return;
        }

        const likeRequest = {
            travelCourseId: travelCourseId,
            userId: loginStatus.userid
        };

        axios.post('http://localhost:9000/travelCourse/toggleLike', likeRequest, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
            .then(response => {
                setLikedStatus(prevState => ({
                    ...prevState,
                    [travelCourseId]: !prevState[travelCourseId], // 좋아요 상태 토글
                }));
            })
            .catch(error => {
                console.error('Error toggling like:', error);
            });
    };

    // 여행 코스 클릭시 상세 페이지로 데이터 전달
    const handleCourseClick = (contentId, hashtag) => {
        navigate(`/travelcourse-info?contentId=${contentId}`, {
            state: {
                hashtag,
            },
        });
    };

    return (
        <section className="travelCourse-section">
            <div className="travelCourse-top">
                <strong>떠나기 좋은 여행 테마 추천!</strong>
                <a href="/tourist" className="material-symbols-outlined">
                    add
                </a>
            </div>

            <div className="main__travelCourse">
                {/* Swiper 컴포넌트로 슬라이드 적용 */}
                <Swiper
                    slidesPerView={3}
                    spaceBetween={20}
                    speed={600}
                    navigation={{
                        prevEl: '.swiper-button-prev',
                        nextEl: '.swiper-button-next',
                    }}
                    pagination={{
                        el: '.custom-pagination',
                        type: 'custom',
                        renderCustom: (swiperInstance, current, total) => {

                            const progress = (current / total) * 100;

                            return `
                                <div class="swiper-progressbar">
                                    <div class="swiper-scrollbar-drag" style="width: ${progress}%;"></div>
                                </div>
                                <div class="swiper-pagination-fraction">
                                    <span class="swiper-pagination-current">${current}</span>
                                    /
                                    <strong class="swiper-pagination-total">${total}</strong>
                                </div>
                            `;
                        }
                    }}
                    modules={[Navigation, Pagination]}
                    className="mySwiper"
                >
                    {courseData.map((course) => {
                        const regionName = regionMap[course.areacode] || '알 수 없음';
                        const hashtag = getHashtag(course.cat2);

                        return (
                            <SwiperSlide key={course.contentid}>
                                <div
                                    className="main__travelCourse-list"
                                    onClick={() => handleCourseClick(course.contentid, hashtag)}
                                >
                                    <button
                                        className={`like-button ${likedStatus[course.contentid] ? 'liked' : 'not-liked'}`}
                                        onClick={(e) => toggleLike(e, course.contentid)}
                                    >
                                    </button>
                                    <img className="main__travelCourse-img" src={course.firstimage} alt={course.title} />
                                    <h4 className="main__travelCourse-title" data-swiper-parallax="-300">
                                        {course.title}
                                    </h4>
                                    <div className="main__travelCourse-tagbox">
                                        <p className="main__travelCourse-region" data-swiper-parallax="-200">
                                            #{regionName}
                                        </p>
                                        <p className="main__travelCourse-hashtag" data-swiper-parallax="-100">
                                            {hashtag}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                    {/* 네비게이션 화살표 */}
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                    {/* 커스텀 페이지네이션 */}
                    <div className="custom-pagination"></div>
                </Swiper>
            </div>
        </section>
    );
};

export default TravelCourseSection;
