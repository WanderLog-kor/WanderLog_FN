import './Main.scss';
import Footer from './Footer.jsx';
import BoardSection from '../main/BoardSection.jsx';
import TouristSection from '../main/TouristSection.jsx';
import MainSection from '../main/MainSection.jsx';
import TravelCourseSection from '../main/TravelCourseSection.jsx';
import Sidebar from './Sidebar.jsx';


const Main = () => {

    return (
        <div className="main-wrapper">

            <main className="main-content">


                <div className="main-content-area">
                    <MainSection />
                    <BoardSection />
                    <TouristSection />
                    <TravelCourseSection />
                </div>

                <Sidebar />

            </main>

            <Footer />
        </div>
    );
}

export default Main;
