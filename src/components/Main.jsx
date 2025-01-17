import { useEffect } from 'react';

import './Main.scss';
import Footer from './Footer.jsx';

import BoardSection from '../main/BoardSection.jsx';
import MainHeader from '../main/MainHeader.jsx';
import TouristSection from '../main/TouristSection.jsx';
import MainSection from '../main/MainSection.jsx';
import TravelCourseSection from '../main/TravelCourseSection.jsx';
import { useLoginStatus } from '../auth/PrivateRoute.jsx';


const Main = () => {
    const { loginStatus } = useLoginStatus();

    console.log('loginStatus : ', loginStatus);
    // 새로고침 버튼 클릭
    const handleRefreshClick = () => {
        window.location.reload();
    }


    return (
        <div className="main-wrapper">
            <MainHeader />

            <main className="main-content">


                <div className="main-content-area">
                    <MainSection />
                    <BoardSection />
                    <TouristSection />
                    <TravelCourseSection />
                </div>

                <aside className="main-sidebar">
                    <ul>
                        <li>
                            <span className="material-symbols-outlined sidebar-refresh" onClick={handleRefreshClick}>
                                refresh
                            </span>
                        </li>

                        <li>
                            <span class="material-symbols-outlined sidebar-mypage">
                                person
                            </span>
                        </li>

                        <li>
                            <span className="material-symbols-outlined sidebar-up-arrow">
                                stat_1
                            </span>
                        </li>

                        <li>
                            <span className="material-symbols-outlined sidebar-down-arrow">
                                stat_minus_1
                            </span>
                        </li>
                    </ul>
                </aside>

            </main>

            <Footer />
        </div>
    );
}

export default Main;
