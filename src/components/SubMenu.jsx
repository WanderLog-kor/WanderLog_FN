
import { Link } from 'react-router-dom';
import touristIcon from './iconImage/tourist-attraction.png';
import travelCourseImg from './iconImage/travel-guide.png';
import homeIcon from './iconImage/house.png';
import boardIcon from './iconImage/itinerary.png'
import './SubMenu.scss';


const Submenu = () => {
    return (
        <nav className="sub-menu">
            <Link to="/" >
                <button className="home-btn">
                    홈
                    <img src={homeIcon}></img>
                </button>
            </Link>

            <Link to="/tourist">
                <button className="tourist-btn">
                    관광지
                    <img src={touristIcon}></img>
                </button>

            </Link>

            <Link to="/travelcourse">
                <button className="travelcourse-btn">
                    여행코스
                    <img src={travelCourseImg}></img>
                </button>

            </Link>

            <Link to="/planner/board">
                <button className="board-btn">
                    사용자코스
                    <img src={boardIcon}></img>
                </button>
            </Link>
        </nav>
    )
}

export default Submenu