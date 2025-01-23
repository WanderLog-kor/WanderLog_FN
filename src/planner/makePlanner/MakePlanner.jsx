import {useState, useEffect, React} from 'react';
import '../../public/reset.css'
import {useLocation, useNavigate} from 'react-router-dom';
import Map from '../Map/Map';
import SideBar from '../SideBar/SideBar';
import './MakePlanner.scss'
import { useLoginStatus } from '../../auth/PrivateRoute';

const MakePlanner = ({}) => {
    const {userid,loginStatus} = useLoginStatus();
    const location = useLocation();
    const { startDate, endDate, areaName, areaCode,coordinates } = location.state || {};

    useEffect(() => {
        // 전달받은 데이터를 확인하는 로그
    }, [areaName, startDate, endDate]); // 의존성 배열에 데이터 추가
    // ------------------------------------------------


    // const [optionState, setOptionState] = useState();
    const [areaState, setAreaState] = useState([]);
    const [plannerData, setPlannerData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(1);
    const [destination, setDestination] = useState();
    const [searchDestination, setSearchDestination] = useState();

    

    // const handleOption = (data) => { setOptionState(data); }

    // const handleArea = (data) => {setAreaState(data);
    //     console.log("Received areaCode:", data);
    // }

    // const handleData = async (data) => {
    //     await axios.post('http://localhost:9000/planner/getImages',
    //         {
    //             'businessName':data.data.name
    //         },
    //     )
    //     .then(resp=>{
    //         const updatedData = {
    //             ...data,  // 기존 data 객체를 복사
    //             image: resp.data.image  // image 키 추가
    //         };
    
    //         // plannerData에 updatedData 추가
    //         setPlannerData((plannerData) => [...plannerData, updatedData]);
    //     })
    //     .catch(err=>{console.log(err)});
    // }

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

    return (
        <div className='planner' >
            <div className='plannerSide' >
                <SideBar
                    areaName={areaName} //도시명 SideBar 로 전달
                    startDate={startDate}
                    endDate={endDate}
                    areaCode={areaCode}
                    userid={userid}
                    // AreaCoordinate={handleArea}
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
                    coordinates={coordinates}
                    AreaData={areaState}
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