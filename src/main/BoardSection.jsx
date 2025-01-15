

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, useRef } from "react";


// Swiper 관련 import 추가
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import './BoardSection.scss';

const BoardSection = () => {
    const [planners, setPlanners] = useState([]);
    const pageSize = 8; // 한 페이지에 표시할 아이템 수

    const navigate = useNavigate();
    const swiperRef = useRef(null);

    const handlePlannerClick = (plannerID) => {
        const plannerItem = planners.find((item) => item.plannerID === plannerID);
        navigate(`planner/board/destination?plannerID=${plannerID}`, { state: { plannerItem } });
    };

    const fetchPlanners = (page) => {
        axios.get(`http://localhost:9000/planner/board?page=${-1}&size=${pageSize}`)
            .then((response) => {
                setPlanners(response.data.content); // 데이터 리스트
            })
            .catch((error) => {
                console.error("플래너 가져오기 실패", error);
            });
    };

    useEffect(() => {
        fetchPlanners();
        if (swiperRef.current) {
            // Autoplay를 명시적으로 시작 (페이지 리로딩 시 시작이 안돼서 수동으로 설정)
            swiperRef.current.autoplay?.start();
        }
    }, [pageSize])

    return (
        <section className="swiper-section">
            <div className="board-top">
                <strong>다른 사람의 코스 구경하기</strong>
                <a href="/planner/board" className="material-symbols-outlined">
                    add
                </a>
            </div>


            <Swiper
                onSwiper={(swiper) => {
                    console.log('Swiper instance:', swiper);
                    swiperRef.current = swiper; // Swiper 인스턴스를 ref에 할당
                    swiper.autoplay?.start();  // 초기화 시 autoplay 시작
                }}
                onSlideChange={() => {
                    swiperRef.current?.autoplay?.start(); // 슬라이드 변경 시 autoplay 보장
                }}
                slidesPerView={4}
                spaceBetween={30}
                speed={1500}
                loop={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false, // 사용자가 슬라이드를 조작한 후에도 자동으로 계속 넘어가게 설정
                }}

                pagination={{
                    clickable: true, // 페이지네이션을 클릭할 수 있도록 설정
                }}
                modules={[Autoplay]}
                className="mySwiper"


            >
                {planners.map((planner) => (
                    <SwiperSlide
                        key={planner.plannerID}
                        onClick={() => handlePlannerClick(planner.plannerID)}
                        onMouseEnter={() => {
                            swiperRef.current?.autoplay?.stop(); // 마우스가 슬라이드 위에 올라왔을 때 autoplay 중지
                        }}
                        onMouseLeave={() => {
                            swiperRef.current?.autoplay?.start(); // 마우스가 슬라이드에서 벗어났을 때 autoplay 다시 시작
                        }}
                    >
                        <div className="main-planner-item">
                            <div className="main-planner-thumbnail">
                                <img src={planner.thumbnailImage} alt="플래너 썸네일" />
                            </div>
                            <div className="main-planner-info">
                                <h3 className="main-planner-title">{planner.plannerTitle}</h3>
                                <p className="main-planner-username">작성자 : {planner.username}</p>
                                <p className="main-planner-duration">
                                    {planner.day === 1
                                        ? '당일코스'
                                        : `${planner.day - 1}박 ${planner.day}일`}
                                </p>
                                <p className="main-planner-created-at">
                                    작성일 {new Date(planner.createAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default BoardSection;
