import {useState, useEffect, React} from 'react';
import '../../public/reset.css'
import {useNavigate} from 'react-router-dom';
import Map from '../Map/Map';
import SideBar from '../SideBar/SideBar';
import './MakePlanner.scss'
import axios from 'axios';

const MakePlanner = ({cookie}) => {
    const navigate = useNavigate();


    // const [optionState, setOptionState] = useState();
    const [areaState, setAreaState] = useState([]);
    const [plannerData, setPlannerData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(1);
    const [destination, setDestination] = useState();
    const [searchDestination, setSearchDestination] = useState();

    // const handleOption = (data) => { setOptionState(data); }

    const handleArea = (data) => {setAreaState(data)}

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

    const handleDay = (data) => { setSelectedDay(data); }

    const handleDeleteDest = (event,day, index) => {
        event.stopPropagation();
        setPlannerData(prevPlannerData =>
            prevPlannerData
                .filter(el => el.day !== day) // 해당 day와 일치하지 않는 항목만 남기기
                .concat(
                    prevPlannerData
                        .filter(el => el.day === day) // 해당 day와 일치하는 항목만 남기기
                        .filter((e, i) => i !== index) // 그 중 index에 해당하는 항목을 제외
                )
        );
    };

    const handleAllDelete = () => { setPlannerData([]); }
    const handleUpdateDest = (data) => { setPlannerData(data) }

    const handleClickPlanner = (data) => {setDestination(data);}
    const handleClickSearch = (data) => {setSearchDestination(data);}

    // useEffect(()=>{
    //     console.log('plannerData : ', plannerData)
    // },[plannerData])

    return (
        <div className='planner' >
            <div className='plannerSide' >
                <SideBar
                    AreaCoordinate={handleArea}
                    DayState={handleDay}
                    DestinationData={plannerData}
                    DeleteDestination={handleDeleteDest}
                    DeleteAllDestination={handleAllDelete}
                    AddDestination={handleData}
                    CookieData={cookie}
                    UpdatePlanner={handleUpdateDest}
                    ClickPlanner={handleClickPlanner}
                    ClickSearch={handleClickSearch}
                />
            </div>
            <div className='plannerBody' >
                {/* <Option OptionData={handleOption}/> */}
                <Map 
                    // OptionData={optionState}
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