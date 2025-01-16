import "./MainSection.scss"
import { useState } from "react";
import closeButtonImage from "../images/closeButton.png";

const travelDestinations = [
    { id: 1, name: '서울', description: '대한민국의 수도인 서울은 현대적인 고층 빌딩, 첨단 기술의 지하철, 대중문화와 사찰, 고궁, 노점상이 공존하는 대도시입니다. 주목할 만한 명소로는 곡선으로 이루어진 외관과 옥상 공원을 특징으로 하는 초현대적 디자인의 컨벤션 홀인 동대문디자인플라자, 한때 7,000여 칸의 방이 자리하던 경복궁, 회화나무와 소나무 고목이 있는 조계사가 있습니다.', image: '/images/makePlanner.png' },
    { id: 2, name: '인천', description: '인천광역시는 대한민국 중서부에 있는 광역시이다. 서쪽으로 서해, 동쪽으로 서울특별시 강서구, 경기도 부천시, 남동쪽으로 시흥시, 북쪽으로 김포시와 접한다. 인천항과 인천국제공항을 중심으로 제조업과 물류와 산업이 발달하였다. 시청 소재지는 남동구 구월동이고, 행정 구역은 8구 2군이다.', image: '/images/trip1.png' },
    { id: 3, name: '대전', description: '대전광역시는 대한민국의 남부에 있는 광역시이다. 경부고속철도, 경부선, 호남선 철도가 분기하고, 경부고속도로와 호남고속도로지선, 통영대전고속도로, 서산영덕고속도로 등 주요 고속도로가 연결되는 교통의 중심이다.', image: '/images/trip2.png' },
    { id: 4, name: '대구', description: '대구광역시는 대한민국의 동남부인 경상북도 지방 내륙에 위치한 광역시이다. 2024년 11월 기준 면적은 1,499.52㎢로 대한민국 광역시 중 가장 넓다. 조선시대에는 경상감영 소재지로서 경상도의 중심지였다.', image: '/images/trip2.png' },
    { id: 5, name: '광주', description: '광주광역시는 대한민국의 남서부에 있는 광역시이다. 남동쪽으로 전라남도 화순군, 북동쪽으로 전라남도 담양군, 서쪽으로 전라남도 함평군, 서남쪽으로 전라남도 나주시, 북쪽으로 전라남도 장성군과 접한다. 시청 소재지는 서구 치평동이고, 행정 구역은 5개 구와 95개 동으로 이루어져 있다.', image: '/images/trip2.png' },
    { id: 6, name: '부산', description: '부산광역시는 한반도 남동부에 위치한 광역시이다. 대한민국의 제2의 도시이자 영남권의 중심 도시, 대한민국 최대의 해양 도시이며, 부산항을 중심으로 해상 무역과 물류 산업이 발달하였다. 일본과는 대한해협을 사이에 두고 마주하고 있다. ', image: '/images/trip2.png' },
    { id: 7, name: '울산', description: '울산광역시는 대한민국 남동부에 있는 광역시이다. 서쪽으로 경상남도 밀양시, 양산시, 경상북도 청도군, 북쪽으로 경상북도 경주시, 남쪽으로 부산광역시 기장군과 접한다. 태화강이 울산광역시를 통과하여 동해로 흐르며, 동해안에 울산항과 방어진항, 온산항이 위치한다.', image: '/images/trip2.png' },
    { id: 8, name: '세종', description: "세종특별자치시로 떠나는 '생생한 상전벽해의 현장 도시 관광 코스'는 산야가 도시로 변모하는 세종특별자치시의 모습을 360˚도로 굽어볼 수 있는 밀마루 전망대에서 시작된다. 그런 다음 5개의 테마 섬으로 구성된 세종호수공원을 비롯하여 세종보의 산책로를 거닒으로 새로이 탄생한 세종특별자치시의 젖줄 금강의 풍광을 가까이한다. 세종 19년(1437)에 양양도호부사를 지낸 임목(林穆)이 건립한 독락정에서 세종특별자치시의 젖줄 금강을 다시 굽어보고, 상류로 올라가 금강이 미호천과 만나 물길을 키우는 곳에 조성된 세종 합강캠핑장을 탐방하고 하늘을 재고 땅을 헤아리는 우주측지의 허브 우주측지관측센터에서 우주의 신비에 성큼 다가설 수 있다.", image: '/images/trip2.png' },
    { id: 9, name: '경기', description: '경기도는 대한민국의 중서부에 있는 도이다. 수도권의 서울특별시와 인천광역시를 둘러싸고 있고, 동쪽으로는 강원특별자치도, 서쪽으로 황해, 남쪽으로는 충청남도 및 충청북도와 접하고, 북쪽으로는 조선민주주의인민공화국 황해북도 및 조선민주주의인민공화국 강원도와 경계를 이룬다. ', image: '/images/trip2.png' },
    { id: 10, name: '강원도', description: '강원특별자치도는 대한민국의 동부에 있는 특별자치도이다. 동쪽은 동해, 서쪽은 경기도, 남쪽은 충청북도·경상북도하고 접하며, 북쪽은 조선민주주의인민공화국의 강원도하고 경계를 이루고 있다.', image: '/images/trip2.png' },
    { id: 11, name: '충북', description: '충청북도는 대한민국의 남부에 위치하는 도이다. 대한민국의 도 중에서 유일하게 바다와 접하지 않는 내륙도이다. 서쪽으로 대전광역시, 세종특별자치시, 충청남도, 동쪽으로 경상북도, 남쪽으로 전북특별자치도, 북쪽으로 경기도, 강원특별자치도와 접한다. ', image: '/images/trip2.png' },
    { id: 12, name: '충남', description: '충청남도는 대한민국의 남부에 위치하는 도이다. 동쪽으로 대전광역시, 세종특별자치시, 충청북도, 남쪽으로 전북특별자치도, 북쪽으로 경기도와 접한다.', image: '/images/trip2.png' },
    { id: 13, name: '경북', description: '경상북도는 대한민국 남동부에 있는 도이다. 동쪽으로는 동해, 서쪽으로는 전북특별자치도·충청북도, 남쪽으로는 대구광역시를 둘러싸며 울산광역시·경상남도와 접하고, 북쪽으로는 강원특별자치도와 경계를 이룬다. 행정구역은 10시 12군이다.', image: '/images/trip2.png' },
    { id: 14, name: '경남', description: '경상남도는 대한민국 남동부에 있는 도이다. 남쪽으로는 남해, 동쪽으로는 부산광역시· 울산광역시, 서쪽으로는 전라남도·전북특별자치도와 경계를 이루고, 북쪽으로는 대구광역시·경상북도와 접한다. 행정구역은 8시 10군이며, 대한민국의 행정 구역 중 관할 면적이 네 번째로 넓다.', image: '/images/trip2.png' },
    { id: 15, name: '전북', description: '전라북도는 대한민국 남서부에 위치한 아름다운 도입니다. 다양한 자연경관과 풍부한 문화유산을 자랑하며, 여행과 관광을 위한 멋진 목적지로 손꼽힙니다. 전주 한옥마을은 전통 한옥 건축물들이 모여 있는 곳으로, 한국의 전통과 문화를 체험할 수 있는 최적의 장소입니다. 전주비빔밥, 한옥 찻집, 전통 공예품 등을 즐길 수 있어 많은 관광객들이 찾는 명소입니다. 부안의 변산반도 국립공원은 해안 절경과 산악 경관을 함께 감상할 수 있는 곳으로, 아름다운 해변과 기암괴석, 그리고 산림욕을 즐길 수 있습니다. 가을철 단풍도 빼놓을 수 없는 절경 중 하나입니다. 남원의 광한루원은 조선시대의 대표적인 정원 중 하나로, 춘향전의 배경이 되었던 곳입니다. 아름다운 정원과 고즈넉한 분위기 속에서 여유로운 산책을 즐길 수 있습니다. 전라북도는 계절마다 다른 매력을 선사하며, 전통과 자연, 그리고 현대적인 요소들이 조화를 이루는 곳입니다. 아름다운 풍경과 다양한 관광 명소를 통해 전라북도의 매력을 마음껏 누려보세요.', image: '/images/trip2.png' },
    { id: 16, name: '전남', description: '전라남도는 대한민국의 남서부에 있는 도이다. 광주광역시를 둘러싸며, 서쪽으로 황해에 면하고, 북쪽으로 전북특별자치도, 동쪽으로는 소백산맥의 지리산과 섬진강을 경계로 경상남도, 남쪽으로는 남해를 경계로 제주특별자치도가 있다.', image: '/images/trip2.png' },
    { id: 17, name: '제주', description: '제주특별자치도는 대한민국의 제주도와 부근 섬들을 관할하는 특별자치도이다. 대한민국에서 가장 큰 섬인 제주도를 비롯하여 마라도, 우도, 추자군도 등을 포함한 유인도 8개, 무인도 55개로 구성되어 있다.', image: '/images/main.jpg' },
];

const MainSection = ()=>{
    const [isMainModalOpen, setIsMainModalOpen] = useState(false);
    const [isDetailModalOpen,setIsDetailModalOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);

    const openMainModal = () => setIsMainModalOpen(true);
    const closeMainModal = () => setIsMainModalOpen(false);

    const openDetailModal = (destination) =>{
        setSelectedDestination(destination);
        setIsDetailModalOpen(true);
    };
    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedDestination(null);
    };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setSelectedDestination(null);
    // };

    // const handleDestinationSelect = (event) =>{
    //     const selectedId = event.target.value;
    //     const destination = travelDestinations.find(dest => dest.id === parseInt(selectedId));
    //     setSelectedDestination(destination);
    // };

    return (
        <section className="main-section">
            <p className="main-section__text">나만의 특별한 여행계획 만들기</p>
            <p className="main-section__subtext">나만의 계획을 생성하고 다른 사람들과 공유해보세요 !</p>
            <button className="main-header__button" onClick={openMainModal}>
                계획 생성하러 가기
            </button>

            {/* 메인 모달 */}
            {isMainModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-close">
                        <img src={closeButtonImage} 
                        alt="닫기" 
                        className="modal-close-btn" 
                        onClick={closeMainModal}/>
                        </div>
                        <h2 className="modal-title">가고 싶은 여행지를 선택하세요</h2>
                        <div className="grid-container">
                            {travelDestinations.map((destination)=>(
                                <div 
                                key={destination.id} 
                                className="grid-item"
                                onClick={()=> openDetailModal(destination)}
                                >
                                    <img src={destination.image}
                                     alt={destination.name}
                                     className="grid-item__image" />
                                    <p className="grid-item__name">{destination.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )} 
            {isDetailModalOpen && selectedDestination && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-close">
                        <img 
                        src={closeButtonImage} 
                        alt="닫기" 
                        className="modal-close-btn" 
                        onClick={closeDetailModal}/>
                        </div>
                        <div className="destination-details">
                            <h2>{selectedDestination.name}</h2>
                            <p>{selectedDestination.description}</p>
                            <img src={selectedDestination.image} 
                            alt={selectedDestination.name}
                            className="destination-image" />
                            <button className="modal-next" 
                            onClick={()=>{
                                closeDetailModal();
                                window.location.href="/makePlanner";
                            }}>일정 만들기</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MainSection;