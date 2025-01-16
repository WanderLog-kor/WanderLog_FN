// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './TravelCourseSection.scss'

// const TravelCourseSection = () => {
//     const regionMap = {
//         "1": "서울",
//         "2": "인천",
//         "3": "대전",
//         "4": "대구",
//         "5": "광주",
//         "6": "부산",
//         "7": "울산",
//         "8": "세종",
//         "31": "경기",
//         "32": "강원",
//         "33": "충북",
//         "34": "충남",
//         "35": "경북",
//         "36": "경남",
//         "37": "전북",
//         "38": "전남",
//         "39": "제주"
//     };

//     // 해시태그를 반환하는 함수
//     function getHashtag(category) {
//         switch (category) {
//             case 'C0112': return '#가족코스';
//             case 'C0113': return '#나홀로코스';
//             case 'C0114': return '#힐링코스';
//             case 'C0115': return '#도보코스';
//             case 'C0116': return '#캠핑코스';
//             case 'C0117': return '#맛코스';
//             default: return '#추천코스';
//         }
//     }
//     const [courseData, setCourseData] = useState([]);
//     const navigate = useNavigate();

//     // 여행 코스 검색 함수
//     const handleSearch = () => {
//         const data = {
//             keyword: '',
//             regionCode: '',
//             hashtag: '',
//             pageNo: 1,
//             arrange: 'O',
//             contentTypeId: '25',
//             numOfRows: 10
//         };

//         axios.post('http://localhost:9000/api/getSearch', data, {
//             headers: {
//                 'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
//             }
//         })
//             .then((response) => {
//                 console.log('response : ', response)
//                 setCourseData(response.data.items.item || []); // 빈 배열로 안전하게 설정
//             })
//             .catch((error) => {
//                 console.error('Error fetching courses:', error);
//             });
//     };

//     // 여행 코스 클릭시 상세 페이지로 데이터 전달
//     const handleCourseClick = (contentId, hashtag) => {

//         navigate(`/travelcourse-info?contentId=${contentId}`, {
//             state: {
//                 hashtag,
//             },
//         });
//     };

//     useEffect(() => {
//         handleSearch();
//     }, []);

//     return (
//         <section className="travelCourse-section">
//             <div className="travelCourse-top">
//                 <strong>떠나기 좋은 여행 테마 추천!</strong>
//                 <a href="/tourist" className="material-symbols-outlined">
//                     add
//                 </a>
//             </div>

//             <div className="main__travelCourse">
//                 {courseData.map((course) => {
//                     const regionName = regionMap[course.areacode] || '알 수 없음';
//                     const hashtag = getHashtag(course.cat2); // 해시태그 가져오기

//                     return (
//                         <div key={course.contentid} className="main__travelCourse-list" onClick={() => handleCourseClick(course.contentid, hashtag)}>
                            
//                             {/* course.firstimage가 존재하는 경우에만 이미지 렌더링 */}
//                             {course.firstimage && (
//                                 <img
//                                     src={course.firstimage}
//                                     alt={course.title}
//                                     className="main__travelCourse-list-img"
//                                 />
//                             )}
//                             <h4 className="main__travelCourse-title">{course.title}</h4>
//                             <div className="main__travelCourse-box">
//                                 {/* 지역 */}
//                                 <p className="main__travelCourse-region">{regionName}</p>
//                                 {/* 코스 태그 */}
//                                 <p className="main__travelCourse-hashtag">{hashtag}</p>
//                             </div>
//                             {/* </Link> */}
//                         </div>

//                     );
//                 })}
//             </div>










//         </section>
//     )
// }

// export default TravelCourseSection















// 스와이퍼 첫번째 !!!!!

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import './TravelCourseSection.scss';

// // Swiper 모듈
// import { Parallax, Pagination, Navigation } from 'swiper/modules';

// const TravelCourseSection = () => {
//     const regionMap = {
//         "1": "서울",
//         "2": "인천",
//         "3": "대전",
//         "4": "대구",
//         "5": "광주",
//         "6": "부산",
//         "7": "울산",
//         "8": "세종",
//         "31": "경기",
//         "32": "강원",
//         "33": "충북",
//         "34": "충남",
//         "35": "경북",
//         "36": "경남",
//         "37": "전북",
//         "38": "전남",
//         "39": "제주"
//     };

//     // 해시태그를 반환하는 함수
//     function getHashtag(category) {
//         switch (category) {
//             case 'C0112': return '#가족코스';
//             case 'C0113': return '#나홀로코스';
//             case 'C0114': return '#힐링코스';
//             case 'C0115': return '#도보코스';
//             case 'C0116': return '#캠핑코스';
//             case 'C0117': return '#맛코스';
//             default: return '#추천코스';
//         }
//     }

//     const [courseData, setCourseData] = useState([]);
//     const navigate = useNavigate();

//     // 여행 코스 검색 함수
//     const handleSearch = () => {
//         const data = {
//             keyword: '',
//             regionCode: '',
//             hashtag: '',
//             pageNo: 1,
//             arrange: 'O',
//             contentTypeId: '25',
//             numOfRows: 10
//         };

//         axios.post('http://localhost:9000/api/getSearch', data, {
//             headers: {
//                 'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
//             }
//         })
//             .then((response) => {
//                 console.log('response : ', response)
//                 setCourseData(response.data.items.item || []); // 빈 배열로 안전하게 설정
//             })
//             .catch((error) => {
//                 console.error('Error fetching courses:', error);
//             });
//     };

//     // 여행 코스 클릭시 상세 페이지로 데이터 전달
//     const handleCourseClick = (contentId, hashtag) => {
//         navigate(`/travelcourse-info?contentId=${contentId}`, {
//             state: {
//                 hashtag,
//             },
//         });
//     };

//     useEffect(() => {
//         handleSearch();
//     }, []);

//     return (
//         <section className="travelCourse-section">
//             <div className="travelCourse-top">
//                 <strong>떠나기 좋은 여행 테마 추천!</strong>
//                 <a href="/tourist" className="material-symbols-outlined">
//                     add
//                 </a>
//             </div>

//             <div className="main__travelCourse">
//                 {/* Swiper 컴포넌트로 슬라이드 적용 */}
//                 <Swiper
//                     style={{
//                         '--swiper-navigation-color': '#fff',
//                         '--swiper-pagination-color': '#fff',
//                     }}
//                     speed={600}
//                     parallax={true}
//                     pagination={{
//                         clickable: true,
//                     }}
//                     navigation={true}
//                     modules={[Parallax, Pagination, Navigation]}
//                     className="mySwiper"
//                 >
//                     {courseData.map((course) => {
//                         const regionName = regionMap[course.areacode] || '알 수 없음';
//                         const hashtag = getHashtag(course.cat2); // 해시태그 가져오기

//                         return (
//                             <SwiperSlide key={course.contentid} style={{ backgroundImage: `url(${course.firstimage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
//                                 <div
//                                     className="main__travelCourse-list"
//                                     onClick={() => handleCourseClick(course.contentid, hashtag)}
//                                     style={{ background: 'rgba(0, 0, 0, 0.5)' }} // 어두운 오버레이 추가
//                                 >
//                                     {/* course.firstimage가 존재하는 경우에만 이미지 렌더링 */}
//                                     <h4 className="main__travelCourse-title" data-swiper-parallax="-300">
//                                         {course.title}
//                                     </h4>
//                                     <div className="main__travelCourse-box">
//                                         {/* 지역 */}
//                                         <p className="main__travelCourse-region" data-swiper-parallax="-200">
//                                             {regionName}
//                                         </p>
//                                         {/* 코스 태그 */}
//                                         <p className="main__travelCourse-hashtag" data-swiper-parallax="-100">
//                                             {hashtag}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </SwiperSlide>
//                         );
//                     })}
//                 </Swiper>
//             </div>
//         </section>
//     );
// }

// export default TravelCourseSection;



























// 스와이퍼 두번째 !!!!

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './TravelCourseSection.scss';

// Swiper 모듈
import { Parallax, Pagination, Navigation, Thumbs, FreeMode } from 'swiper/modules';

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
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const navigate = useNavigate();

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
            headers: {
                'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
            }
        })
            .then((response) => {
                console.log('response : ', response)
                setCourseData(response.data.items.item || []); // 빈 배열로 안전하게 설정
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
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

    useEffect(() => {
        handleSearch();
    }, []);

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
                    style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                    }}
                    loop={true}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Parallax, Pagination, Navigation, Thumbs]}
                    className="mySwiper"
                >
                    {courseData.map((course) => {
                        const regionName = regionMap[course.areacode] || '알 수 없음';
                        const hashtag = getHashtag(course.cat2); // 해시태그 가져오기

                        return (
                            <SwiperSlide key={course.contentid} style={{ backgroundImage: `url(${course.firstimage})`, width: '100%', height: '600px',  objectFit: 'contain'}}>
                                <div
                                    className="main__travelCourse-list"
                                    onClick={() => handleCourseClick(course.contentid, hashtag)}
   
                                >
                                    <h4 className="main__travelCourse-title" data-swiper-parallax="-300">
                                        {course.title}
                                    </h4>
                                    <div className="main__travelCourse-box">
                                        <p className="main__travelCourse-region" data-swiper-parallax="-200">
                                            {regionName}
                                        </p>
                                        <p className="main__travelCourse-hashtag" data-swiper-parallax="-100">
                                            {hashtag}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* 썸네일 Swiper */}
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2"
                >
                    {courseData.map((course) => (
                        <SwiperSlide key={course.contentid}>
                            <img className="mySwiper2-img" src={course.firstimage} alt={course.title} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default TravelCourseSection;
