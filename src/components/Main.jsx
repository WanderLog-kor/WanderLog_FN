
import './Main.scss';
import Footer from './Footer.jsx';

import BoardSection from '../main/BoardSection.jsx';
import MainHeader from '../main/MainHeader.jsx';
import TouristSection from '../main/TouristSection.jsx';
import MainSection from '../main/MainSection.jsx';

const Main = () => {


    return (
        <div className="main-wrapper">
            <MainHeader />
            <main className="main-main">
                <MainSection />
                <BoardSection />
                <TouristSection />

            </main>
            <Footer />
        </div>
    );
}

export default Main;
