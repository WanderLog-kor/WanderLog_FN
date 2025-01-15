
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import touristJson from '../tourist/jsonFile/tourist.json';

const TouristSection = () => {

    const [regionFilter, setRegionFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [hashtagOptions, setHashtagOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [touristData, setTouristData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [totalCount, setTotalCount] = useState(0);  // totalCount를 숫자형으로 초기화
    const [arrange, setArrange] = useState('O');
    const navigate = useNavigate();

    const getRegionName = (regionCode) => {
        return touristJson.regions[regionCode] || '알 수 없음'; // 해당 지역 코드가 없으면 기본값 '알 수 없음'
    };

    // 해시태그를 가져오는 함수 (cat2 값에 따라)
    const getHashtag = (cat2) => {
        return touristJson.categorys[cat2] || '기타'; // 해당 category가 없으면 기본값 '기타'
    };

    // 관광지 검색 함수
    const handleSearch = () => {
        setLoading(true); // 검색 시작 시 로딩 상태 true로 설정

        const data = {
            pageNo: currentPage,
            hashtag: categoryFilter,  // 해시태그 필터가 있다면 설정
            regionCode: regionFilter,
            arrange: arrange,  // 원하는 정렬 방식
            contentTypeId: '12',  // 필요에 맞게 설정
        };

        axios.post('http://localhost:9000/api/getSearch', data, {

            headers: {
                'Content-Type': 'application/json', // Content-Type을 JSON으로 설정
            },
            withCredentials: true,
        })
            .then((response) => {
                console.log('response : ', response);
                setTouristData(response.data.items.item || []); // 빈 배열로 안전하게 설정
                setTotalCount(Number(response.data.totalCount));  // totalCount를 숫자로 설정
                setLoading(false); // 로딩 상태 false로 설정
            })

            .catch((error) => {
                console.error('Error fetching courses:', error);
                setLoading(false); // 에러가 나도 로딩 상태 false로 설정
            });
    };

    // 여행 코스 클릭시 상세 페이지로 데이터 전달
    const handleTouristClick = (contentId) => {
        setLoading(true); // 로딩 시작

        navigate(`/tourist-info?contentId=${contentId}`);
    };

    useEffect(() => {
        handleSearch();
    }, [])

    return (
        <div className="travel-course-list-content">
            {touristData.map((tourist) => {
                const regionName = getRegionName(tourist.areacode); // 지역 이름 가져오기
                const hashtag = getHashtag(tourist.cat3); // 해시태그 가져오기

                return (
                    <div key={tourist.contentid} className="travel-course-list" onClick={() => handleTouristClick(tourist.contentid)}>
                        {tourist.firstimage && (
                            <img
                                src={tourist.firstimage}
                                alt={tourist.title}
                                className="travel-course-list__img"
                            />
                        )}
                        <h4 className="course-title">{tourist.title}</h4>
                        <div className="course-box">
                            {/* 지역 */}
                            <p className="course-region">{regionName}</p>
                            {/* 코스 태그 */}
                            <p className="course-hashtag">{hashtag}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default TouristSection