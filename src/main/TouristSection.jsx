import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TouristSection.scss';

const TouristSection = () => {
    const [touristData, setTouristData] = useState([]);  // 관광지 데이터
    const [loginStatus, setLoginStatus] = useState('');  // 로그인 상태
    const [likedStatus, setLikedStatus] = useState({});  // 각 관광지별 좋아요 상태 관리
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 상태 확인
        axios.post('http://localhost:9000/api/cookie/validate', {}, {
            withCredentials: true,
        })
            .then(response => {
                setLoginStatus(response.data);  // 로그인 상태
                console.log(response.data);
            })
            .catch(error => {
                setLoginStatus('');  // 로그인되지 않은 상태
                console.log('로그인 정보 없음');
            });

        // 관광지 데이터 로드
        handleSearch();
    }, []);

    // 여행 코스 클릭시 상세 페이지로 데이터 전달
    const handleTouristClick = (contentId) => {
        navigate(`/tourist-info?contentId=${contentId}`);
    };

    // 관광지 데이터 가져오는 함수
    const handleSearch = () => {
        const maxPage = Math.ceil(8300 / 10);
        const randomPage = Math.floor(Math.random() * maxPage) + 1;

        const data = {
            keyword: '',
            // 테스트용으로 1페이지 고정 (randomPage함수로 변경 해야함)
            pageNo: 1,
            hashtag: '',
            regionCode: '',
            numOfRows: 10,
            arrange: 'O',
            contentTypeId: '12',
        };

        axios.post('http://localhost:9000/api/getSearch', data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
            .then((response) => {
                setTouristData(response.data.items.item || []);
                console.log(response.data.items);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    };

    // 좋아요 상태 가져오기
    const getLikeStatus = (touristId) => {
        if (loginStatus && loginStatus.userid) {  // 로그인 상태가 있을 때만 호출
            axios.get(`http://localhost:9000/tourist/likeStatus?touristId=${touristId}&userId=${loginStatus.userid}`, {
                withCredentials: true,
            })
                .then(response => {
                    setLikedStatus(prevState => ({
                        ...prevState,
                        [touristId]: response.data, // 응답 데이터 그대로 사용 (boolean 상태일 경우)
                    }));
                })
                .catch(error => {
                    console.error('Error fetching like status:', error);
                });
        }
    };

    useEffect(() => {
        // 로그인 상태가 변경되면 각 관광지의 좋아요 상태를 가져옵니다
        if (loginStatus && loginStatus.userid) {
            touristData.forEach(tourist => {
                getLikeStatus(tourist.contentid);
            });
        }
    }, [loginStatus, touristData]);  // loginStatus 또는 touristData가 변경될 때마다 호출

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

        axios.post('http://localhost:9000/tourist/toggleLike', likeRequest, {
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
            .catch(error => {
                console.error('Error toggling like:', error);
            });
    };

    return (
        <section className="tourist-section">
            <div className="tourist-content">
                <div className="tourist-top">
                    <strong>어디로 가볼까?</strong>
                    <a href="/tourist" className="material-symbols-outlined">
                        add
                    </a>
                </div>

                <div className="main__tourist-info">
                    {touristData.map((tourist) => {
                        const { contentid, title, firstimage, addr1 } = tourist;
                        const shortAddress = addr1 ? addr1.split(" ")[0] + " " + addr1.split(" ")[1] : ''; // 주소에서 시까지만

                        return (
                            <div key={contentid} title={title} className="main__tourist-card" style={{ '--image-url': `url(${firstimage})` }} onClick={() => handleTouristClick(tourist.contentid)}>
                                {firstimage && (
                                    <img
                                        src={firstimage}
                                        alt={title}
                                        className="main__tourist-img"
                                    />
                                )}
                                <h4 className="main__tourist-title">{title}</h4>
                                <div className="main__tourist-box">
                                    <p className="main__tourist-region">{shortAddress}</p>

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
            </div>
        </section>
    );
};

export default TouristSection;
