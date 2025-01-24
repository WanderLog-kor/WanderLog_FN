import './Main.scss';
import Footer from './Footer.jsx';
import BoardSection from '../main/BoardSection.jsx';
import TouristSection from '../main/TouristSection.jsx';
import MainSection from '../main/MainSection.jsx';
import TravelCourseSection from '../main/TravelCourseSection.jsx';
import Sidebar from './Sidebar.jsx';
import Submenu from './SubMenu.jsx';


const Main = () => {

    return (
        <div className="main-wrapper">

            <MainSection />
            <main className="main-content">
                <Submenu />


                <BoardSection />
                <TouristSection />
                <TravelCourseSection />


                <Sidebar />

            </main>

            <Footer />
        </div>
    );
}

export default Main;
