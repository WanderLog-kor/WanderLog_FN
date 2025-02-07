import {useState, useEffect, React} from 'react';
import '../../public/reset.css'
import {useLocation, useNavigate} from 'react-router-dom';
import Map from '../Map/Map';
import SideBar from '../SideBar/SideBar';
import './MakePlanner.scss'
import { useLoginStatus } from '../../auth/PrivateRoute';

const MakePlanner = ({}) => {
    const {loginData,loginStatus} = useLoginStatus();
    const location = useLocation();
    const navigate = useNavigate();


    const [areaState, setAreaState] = useState([]);
    const [plannerData, setPlannerData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(1);
    const [destination, setDestination] = useState();
    const [searchDestination, setSearchDestination] = useState();

    const updatePlannerData = location.state?.updatePlannerData || {};
    const newPlannerData = location.state || {};

    const [travelData , setTravelData] = useState(
        Object.keys(updatePlannerData).length > 0 ? updatePlannerData : newPlannerData
    );

    useEffect(()=>{

        if(travelData?.destinations) {

            const formattedDestinations = travelData.destinations.map(dest => ({
                day: dest.day,
                data: {
                    name: dest.name,
                    category: dest.category,
                    address: dest.address,
                    x: dest.x,
                    y: dest.y,
                    image: dest.image,
                    uniqueId:dest.uniqueId,
                }
            }));

            setPlannerData(formattedDestinations);
        }
    },[travelData]);
    

    useEffect(()=>{
        if(!location.state) {
            const backupData = sessionStorage.getItem("travelData");
            if(backupData) {
                const parsedData = JSON.parse(backupData);
                setTravelData(parsedData);
            }else{
                alert("여행 정보를 찾을 수 없습니다. 다시 설정해주세요.");
                navigate("/"); // 데이터가 없으면 홈으로 이동
            }
        }
    },[location.state,navigate]);

    const handleData = (data) => {
        setPlannerData((plannerData)=> [...plannerData, data]);
    }

    const handleDay = (data) => { setSelectedDay(data); } //N일차 저장 함수

    const handleRemove = (data) => {
        setPlannerData((prevPlannerData) => prevPlannerData.filter((item) => item.data.id !== data.id));
    };

    const handleDeleteDest = ({day,data}) => {
        const uniqueId = data.uniqueId;

        setPlannerData((prevPlannerData) =>
            prevPlannerData
                .filter(el => el.day !== day) // 해당 day와 일치하지 않는 항목만 남기기
                .concat(
                    prevPlannerData
                        .filter(el => el.day === day) // 해당 day와 일치하는 항목만 남기기
                        .filter((el) => el.data.uniqueId !== uniqueId) // uniqueId가 다른 항목만 유지
                )
        );
    };

    const handleAllDelete = () => { setPlannerData([]);}
    const handleUpdateDest = (data) => { setPlannerData(data) }

    const handleClickPlanner = (data) => {setDestination(data);}
    const handleClickSearch = (data) => {setSearchDestination(data);}
    
    useEffect(() => {
    }, [updatePlannerData]);
    useEffect(() => {
    }, [updatePlannerData]);
    

    return (
        <div className='planner' >
            <div className='plannerSide' >
                <SideBar
                    areaName={travelData.areaName} //도시명 SideBar 로 전달
                    startDate={travelData.startDate}
                    endDate={travelData.endDate}
                    areaCode={travelData.areaCode}
                    loginData={loginData}
                    // AreaCoordinate={handleArea}
                    plannerid={travelData?.plannerid}
                    destination={travelData.destinations}
                    DayState={handleDay}
                    DestinationData={plannerData}
                    DeleteDestination={handleDeleteDest}
                    DeleteAllDestination={handleAllDelete}
                    AddDestination={handleData}
                    RemoveDestination={handleRemove}
                    UpdatePlanner={handleUpdateDest}
                    ClickPlanner={handleClickPlanner}
                    ClickSearch={handleClickSearch}
                />
            </div>
            <div className='plannerBody' >
                {/* <Option OptionData={handleOption}/> */}
                <Map 
                    // OptionData={optionState}
                    coordinates={travelData.coordinates}
                    AreaData={travelData.areaState}
                    DayData={selectedDay}
                    AddDestination={handleData}
                    ClickDestination={destination}
                    ClickSearchDestination={searchDestination}
                />
            </div>

        </div>
    )
}

export default MakePlanner;