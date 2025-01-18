import { useEffect, useState } from "react";
import closeButtonImage from "../images/closeButton.png"
import "./MainSection.scss";
import { useNavigate } from "react-router-dom";



const travelDestinations = [
    { id: 1, name: '서울', description: '서울은 전통과 현대가 어우러진 대한민국의 수도로, 다양한 매력을 지닌 도시입니다. 고즈넉한 고궁인 경복궁과 창덕궁에서 한국의 역사와 문화를 체험할 수 있으며, 북촌 한옥마을에서는 전통 한옥의 아름다움을 느낄 수 있습니다. 명동과 강남에서는 쇼핑과 트렌디한 맛집을 즐길 수 있으며, 한강 공원은 여유로운 산책과 야경 감상에 제격입니다. 남산타워에서는 서울의 전경을 한눈에 볼 수 있으며, 밤에는 화려한 도시의 불빛이 감동을 더합니다. 또한 전통시장인 광장시장과 현대적인 이태원은 다양한 음식을 맛볼 수 있는 미식의 천국입니다. 서울은 과거와 현재를 동시에 만날 수 있는 매혹적인 여행지로, 누구에게나 특별한 추억을 선사합니다.', image: '/images/tripImages/seoul.png' },
    { id: 2, name: '인천', description: '인천은 대한민국의 관문으로 불리는 항구 도시로, 다양한 문화와 매력을 자랑합니다. 인천국제공항이 위치해 전 세계로 연결되며, 송도국제도시에서는 현대적인 도시 풍경과 첨단 기술을 경험할 수 있습니다. 월미도와 차이나타운은 인천의 독특한 관광 명소로, 월미도에서는 바다를 배경으로 한 놀이기구와 야경을, 차이나타운에서는 이국적인 음식과 문화를 즐길 수 있습니다. 강화도에서는 고즈넉한 전통과 자연을 만끽하며 역사의 흔적을 따라 여행할 수 있습니다. 또한, 소래포구와 을왕리 해변에서는 신선한 해산물과 여유로운 바다 풍경을 즐길 수 있어, 도심 속에서도 자연의 매력을 느낄 수 있는 도시입니다.', image: '/images/tripImages/incheon.png' },
    { id: 3, name: '대전', description: '대전은 과학과 자연이 공존하는 매력적인 도시입니다. 대덕연구단지와 엑스포과학공원에서는 첨단 기술과 과학 체험을 즐길 수 있습니다. 계룡산 국립공원은 사계절 아름다운 자연 경관과 등산로를 제공하며, 장태산 자연휴양림은 메타세쿼이아 숲길로 유명한 힐링 명소입니다. 대전 중앙시장은 지역 특산 음식을 맛볼 수 있는 전통시장으로, 따뜻한 지역 문화를 느낄 수 있습니다. 유성온천은 피로를 풀어주는 천연 온천지로 유명하며, 대전예술의전당과 이응노미술관에서는 수준 높은 문화와 예술을 경험할 수 있습니다. 교통이 편리해 수도권과 충청권의 중심지로 접근성이 뛰어나며, 과학과 자연, 문화가 조화로운 여행지로 손색이 없습니다.', image: '/images/tripImages/daejeon.png' },
    { id: 4, name: '대구', description: '대구는 전통과 현대가 조화를 이루는 매력적인 도시입니다. 팔공산은 대구를 대표하는 자연 명소로, 동화사와 케이블카, 단풍길이 특히 유명합니다. 서문시장은 대구의 대표적인 전통시장으로, 다양한 먹거리와 활기찬 분위기를 즐길 수 있습니다. 김광석다시그리기길은 음악과 예술을 사랑하는 이들에게 감동을 주는 감성적인 거리입니다. 대구 근대골목 투어는 한국 근대사의 흔적을 따라 걸으며 역사를 배울 수 있는 특별한 경험을 제공합니다. 또한, 이월드와 83타워에서는 도시 전경과 놀이시설을 즐길 수 있어 가족 단위 여행객들에게 인기가 많습니다. 대구는 따뜻한 기후와 친절한 사람들로 여행자에게 편안함과 즐거움을 선사하는 도시입니다.', image: '/images/tripImages/daegu.jpg' },
    { id: 5, name: '광주', description: '광주는 예술과 역사, 자연이 어우러진 도시입니다. 국립아시아문화전당은 아시아 문화를 선보이는 예술과 창작의 중심지로, 현대적인 전시와 공연을 즐길 수 있습니다. 무등산 국립공원은 사계절 아름다운 풍경과 함께 트레킹과 힐링을 즐기기에 완벽한 장소입니다. 5·18 민주광장은 민주화운동의 역사를 기념하며, 의미 있는 역사의 흔적을 배울 수 있는 곳입니다. 송정역 시장은 광주의 특산물과 남도 음식을 맛볼 수 있는 곳으로 미식 여행자들에게 특히 인기가 많습니다. 양림동 역사문화마을은 근대문화와 전통이 어우러진 감성적인 골목으로, 다양한 카페와 전시를 탐방할 수 있습니다. 광주는 예술과 역사를 사랑하는 사람들에게 깊은 감동을 주는 도시입니다.', image: '/images/tripImages/gwangju.jpg' },
    { id: 6, name: '부산', description: '부산은 바다와 도시의 매력을 동시에 느낄 수 있는 대한민국 제2의 도시입니다. 해운대와 광안리 해수욕장은 아름다운 해변과 야경으로 유명하며, 감천문화마을은 알록달록한 건물과 예술적인 골목으로 인기 있는 포토 스팟입니다. 자갈치시장은 신선한 해산물을 맛볼 수 있는 부산 대표 전통시장으로 활기가 넘칩니다. 태종대는 푸른 바다와 울창한 숲이 어우러져 트레킹과 휴식에 제격이며, 송도 케이블카는 바다 위를 가로지르는 짜릿한 경험을 선사합니다. 동백섬과 오륙도 스카이워크는 부산의 자연을 더욱 가까이 느낄 수 있는 명소입니다. 부산은 다채로운 관광지와 따뜻한 사람들로 누구에게나 잊지 못할 추억을 선사하는 도시입니다.', image: '/images/tripImages/busan.png' },
    { id: 7, name: '울산', description: '울산은 자연과 산업이 공존하는 매력적인 도시입니다. 대왕암공원은 기암괴석과 탁 트인 동해를 감상할 수 있는 일출 명소로, 간절곶은 한반도에서 가장 먼저 해가 뜨는 곳으로 유명합니다. 태화강 국가정원은 넓은 대나무숲과 계절마다 피어나는 꽃들로 힐링을 선사하는 공간입니다. 울산대공원은 가족 여행객들에게 인기 있는 휴식처로, 다양한 놀이시설과 자연 체험을 즐길 수 있습니다. 반구대 암각화는 선사 시대의 예술과 문화를 느낄 수 있는 중요한 유적지입니다. 울산의 전통시장에서는 신선한 해산물과 지역 특산품을 맛볼 수 있으며, 산업 도시답게 울산대교 전망대에서는 화려한 야경을 감상할 수 있습니다.', image: '/images/tripImages/ulsan.png' },
    { id: 8, name: '세종', description: "세종은 계획적인 도시 설계와 풍부한 자연이 조화를 이루는 행정 중심지입니다. 세종호수공원은 대한민국 최대 규모의 인공호수로, 산책로와 자전거길, 다양한 공연이 어우러진 힐링 명소입니다. 국립세종도서관은 독특한 건축미와 쾌적한 환경으로 책을 사랑하는 사람들에게 매력적인 공간입니다. 인근의 베어트리파크는 다양한 동식물과 사계절의 아름다움을 즐길 수 있는 자연 체험지로 가족 여행객에게 인기입니다. 세종청사 전망대에서는 도시 전경을 한눈에 내려다볼 수 있으며, 금강 자전거길은 자연 속에서 여유로운 시간을 보내기에 완벽합니다. 세종은 행정과 자연, 문화가 조화를 이루는 현대적인 도시로 여유롭고 특별한 여행을 선사합니다.", image: '/images/tripImages/sejong.jpg' },
    { id: 9, name: '경기', description: '경기도는 서울과 가까운 위치와 풍부한 관광 명소로 다양한 매력을 지닌 지역입니다. 에버랜드와 캐리비안 베이는 가족 여행객들에게 인기 있는 테마파크로 스릴과 재미를 제공합니다. 수원 화성은 세계문화유산으로, 아름다운 성곽을 따라 역사의 흔적을 느낄 수 있습니다. 가평의 남이섬은 사계절 아름다운 자연과 드라마 촬영지로 유명하며, 근처의 쁘띠프랑스와 제비꽃길도 인기를 끌고 있습니다. 파주의 임진각과 DMZ는 평화와 분단의 역사를 이해할 수 있는 특별한 장소입니다. 또한 양평 두물머리와 연천 재인폭포 등은 자연 속에서 여유를 즐기기에 완벽합니다. 경기도는 전통과 현대, 자연과 문화가 조화를 이루는 다채로운 여행지입니다.', image: '/images/tripImages/gyungki.jpg' },
    { id: 10, name: '강원도', description: '강원도는 사계절 내내 자연의 아름다움을 만끽할 수 있는 대한민국 대표 여행지입니다. 설악산과 오대산은 웅장한 산세와 단풍, 겨울 설경으로 등산객들에게 사랑받는 명소입니다. 강릉의 정동진은 일출을 감상하기 좋은 장소로 유명하며, 안목 커피거리에서는 바다를 보며 여유를 즐길 수 있습니다. 평창 대관령은 드넓은 초원과 맑은 공기로 힐링을 제공하며, 동계 스포츠의 중심지로도 잘 알려져 있습니다. 속초에서는 신선한 해산물과 속초 중앙시장을 즐길 수 있으며, 동해안의 아름다운 해변과 항구는 여행자들에게 잊지 못할 추억을 선사합니다. 강원도는 자연과 문화, 미식이 어우러진 천혜의 관광지입니다.', image: '/images/tripImages/kangwondo.jpg' },
    { id: 11, name: '충북', description: '충북은 산과 호수, 역사가 어우러진 내륙의 보석 같은 지역입니다. 단양은 도담삼봉, 구담봉, 온달동굴 등 빼어난 자연경관과 함께 패러글라이딩 같은 레저 활동으로 유명합니다. 충주호는 청풍호반 유람선을 타며 아름다운 풍경을 감상할 수 있는 인기 명소입니다. 속리산 국립공원은 웅장한 산세와 법주사 같은 유서 깊은 사찰로 힐링을 선사합니다. 청주의 국립청주박물관과 직지심체요절은 한국의 인쇄 문화와 역사를 만날 수 있는 특별한 장소입니다. 제천의 청풍문화재단지는 문화재와 함께 한적한 호수 풍경을 즐길 수 있는 힐링 명소로 사랑받습니다. 충북은 자연과 역사, 레저를 함께 즐길 수 있는 매력적인 여행지입니다.', image: '/images/tripImages/chungbuk.jpg' },
    { id: 12, name: '충남', description: '충남은 풍부한 자연과 역사, 문화가 어우러진 매력적인 지역입니다. 공주의 공산성과 송산리 고분군은 백제의 역사를 간직한 세계문화유산으로, 고즈넉한 고대의 숨결을 느낄 수 있습니다. 부여의 정림사지와 궁남지는 백제문화의 정수를 보여주는 유적지입니다. 태안해안국립공원은 천혜의 자연경관을 자랑하며, 꽃지해변의 낙조는 빼놓을 수 없는 아름다운 풍경입니다. 서산의 간월암은 밀물과 썰물에 따라 드러나는 신비로운 사찰로 유명합니다. 예산의 수덕사는 고즈넉한 사찰 분위기 속에서 여유를 즐기기에 좋습니다. 충남은 바다와 산, 역사를 모두 품은 다채로운 매력으로 여행자들에게 특별한 경험을 선사합니다.', image: '/images/tripImages/chungnam.jpg' },
    { id: 13, name: '경북', description: '경북은 유구한 역사와 자연이 조화를 이룬 지역으로, 다양한 관광 자원을 자랑합니다. 경주의 불국사와 석굴암은 세계문화유산으로, 신라 천년의 역사와 문화를 느낄 수 있는 명소입니다. 안동의 하회마을은 한국 전통 한옥과 유교문화를 간직한 곳으로, 세계적으로도 유명한 유산입니다. 문경새재는 아름다운 산세와 옛길의 정취로 트레킹과 힐링을 즐기기에 좋습니다. 포항의 호미곶은 한반도에서 가장 먼저 해가 뜨는 장소로, 일출 명소로 유명합니다. 청송은 주왕산 국립공원과 청송사과로 잘 알려져 있으며, 자연과 미식의 즐거움을 함께 제공합니다. 경북은 전통과 자연이 어우러진 매력적인 여행지로, 풍성한 볼거리와 즐길 거리를 제공합니다.', image: '/images/tripImages/gyungbuk.jpg' },
    { id: 14, name: '경남', description: '경남은 다채로운 자연과 역사, 그리고 활기찬 도시가 공존하는 매력적인 지역입니다. 통영은 한려해상국립공원과 동피랑 마을, 통영 케이블카로 유명하며, 신선한 해산물 요리도 즐길 수 있습니다. 거제는 바람의 언덕과 외도 보타니아가 대표적인 명소로, 탁 트인 바다 풍경이 매력적입니다. 창원의 주남저수지는 철새들의 낙원으로, 자연과 생태를 체험하기 좋은 곳입니다. 진주의 진주성은 임진왜란의 역사를 간직한 유적지로, 남강유등축제는 화려한 볼거리로 인기를 끕니다. 남해는 다도해의 아름다운 풍경과 독일마을 같은 독특한 문화 공간을 제공하며, 합천의 해인사는 팔만대장경으로 유명한 세계문화유산입니다. 경남은 자연과 역사가 조화로운 여행지로 다채로운 경험을 선사합니다.', image: '/images/tripImages/gyungnam.jpg' },
    { id: 15, name: '전북', description: '전북은 전통과 자연, 맛이 어우러진 대한민국의 매력적인 여행지입니다. 전주의 전주한옥마을은 한국의 전통 건축과 문화를 체험할 수 있는 명소로, 한옥 체험과 전통음식을 즐길 수 있습니다. 익산의 미륵사지와 왕궁리 유적은 백제의 역사를 간직한 세계문화유산으로 유명합니다. 군산은 근대문화유산이 가득한 도시로, 경암동 철길마을과 신흥동 일본식 가옥은 과거로의 시간 여행을 제공합니다. 순창의 강천산은 가을 단풍과 출렁다리로 인기가 많으며, 무주의 무주덕유산리조트는 스키와 자연 탐방을 함께 즐길 수 있는 명소입니다. 또한, 전북은 비빔밥과 전주콩나물국밥 등 맛있는 음식이 풍부해 미식 여행자들에게 사랑받는 지역입니다.', image: '/images/tripImages/jeonbuk.jpg' },
    { id: 16, name: '전남', description: '전남은 자연과 전통, 섬 여행의 매력을 지닌 지역입니다. 여수는 돌산대교와 오동도, 낭만적인 밤바다로 유명하며, 여수 엑스포와 해상 케이블카는 꼭 들러야 할 명소입니다. 순천만 국가정원과 순천만 습지는 생태관광지로, 아름다운 풍경과 함께 자연을 배울 수 있는 곳입니다. 보성의 녹차밭은 푸른 초원이 펼쳐진 듯한 독특한 풍경으로 사진 명소로 사랑받습니다. 목포는 유달산과 항구를 중심으로 과거와 현재를 잇는 도시로, 맛있는 해산물과 고하도 해상데크로 유명합니다. 담양의 죽녹원은 대나무숲 산책길로 힐링을 선사하며, 곡성 섬진강 기차마을은 가족 여행객에게 인기입니다. 전남은 자연과 문화, 맛이 풍부한 특별한 여행지입니다.', image: '/images/tripImages/jeonnam.jpg' },
    { id: 17, name: '제주', description: '제주는 대한민국의 대표적인 휴양지로, 천혜의 자연경관과 독특한 문화를 자랑합니다. 한라산은 사계절마다 다른 매력을 선사하는 등산 명소로, 정상에서 제주의 광활한 풍경을 감상할 수 있습니다. 성산일출봉은 세계자연유산으로, 일출을 감상하기에 완벽한 장소입니다. 협재해수욕장과 중문해수욕장은 맑고 푸른 바다로 유명하며, 섭지코지와 우도는 제주 특유의 아름다움을 느낄 수 있는 인기 명소입니다. 제주 올레길은 섬을 따라 걷는 트레일로, 자연과 함께하는 특별한 경험을 제공합니다. 동문시장과 흑돼지 거리에서는 제주만의 신선한 해산물과 먹거리를 즐길 수 있습니다. 제주도는 자연, 문화, 맛이 어우러진 완벽한 힐링 여행지입니다.', image: '/images/tripImages/jeju.jpg' },
];

const MainSection = ()=>{
    const [isMainModalOpen,setIsMainModalOpen] = useState(false);
    const [selectedDestination , setSelectedDestination] = useState(travelDestinations[0]);
    const navigate = useNavigate();
    const [step , setStep] = useState(1); // 단계 설정.
    const [dateRange , setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const openMainModal = () => {
        setIsMainModalOpen(true);
        setStep(1); //초기 1단계로 설정
    };
    const closeMainModal = ()=> {
        setIsMainModalOpen(false);
        setStep(1); //단계 처음으로 초기화
    }

    const handleDestinationSelect = (destination) => {
        setSelectedDestination(destination);
        setStep(2); //2단계로 이동(날짜 선택)
    };

    const handleDateChange = (ranges) =>{
        setDateRange([ranges.selection]);
    }

    const handleNext = () =>{
        const selectedCity = selectedDestination?.name;
        const {startDate,endDate} = dateRange[0];

        if(!selectedCity) { //도시를 선택하지 않을 시
            alert("도시를 선택해주세요 !");
            return ;
        }

        if(!startDate) {    //날짜를 선택하지 않을 시
            alert("날짜를 선택해주세요 !");
            return ;
        }

        navigate("/makePlanner", {
            state: {
                city : selectedCity,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString,
            },
        });
        closeMainModal();
    };

    //ESC 누를 시에 모달 창이 꺼지도록 하는 이벤트 리스너
    useEffect(()=>{
        const handleKeyDown = (event) =>{
            if (event.key === "Escape" && isMainModalOpen) {
                closeMainModal();
            }
        };

        window.addEventListener("keydown",handleKeyDown);
        return () =>{
            window.removeEventListener("keydown",handleKeyDown);
        };
    },[isMainModalOpen]);

    return (
        // 메인 페이지 부분
        <section className="main-section">
            <p className="main-section__text">나만의 특별한 여행계획 만들기</p>
            <p className="main-section__subtext">나만의 계획을 생성하고 다른 사람들과 공유해보세요 !</p>
            <button className="main-header__button" onClick={openMainModal}>계획 생성하러 가기</button>

            {/* 모달 */}
            {isMainModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-close">
                            <img src={closeButtonImage} 
                            alt="닫기"
                            className="modal-close-btn"
                            onClick={closeMainModal}
                            />
                        </div>
                        <div className="modal-body">
                            {step === 1 && (
                                <>
                                    
                                </>
                            )}

                            {/* 왼쪽 리스트 부분 */}
                            <div className="modal-list">
                                {travelDestinations.map((destination)=>(
                                    <div
                                    key={destination.id}
                                    className={`list-item ${selectedDestination.id===destination.id ? "active" :  ""}`}
                                    onClick={()=> handleDestinationSelect(destination)}
                                    >
                                        {destination.name}
                                    </div>
                                ))}
                            </div>

                            {/* 오른쪽 상세정보 부분 */}
                            <div className="modal-details">
                                {/* 이미지 나오는 부분 */}
                                <div className="details-image-container">
                                    <img src={selectedDestination.image} 
                                    alt={selectedDestination.name}
                                    className="details-image"
                                    />
                                </div>
                                {/* 상세설명 부분 */}
                                <div className="details-content">
                                   <h2 className="details-title">{selectedDestination.name}</h2>
                                   <p className="details-description">{selectedDestination.description}</p>
                                  <button
                                   className="modal-next"
                                  onClick={()=>{
                                       closeMainModal();
                                       navigate("/makePlanner", {state: {city : selectedDestination.name}});
                                    //  window.location.href="/makePlanner";
                                   }}
                                   >
                                     일정 만들기
                                   </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};


export default MainSection;