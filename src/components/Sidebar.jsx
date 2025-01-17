import { Link } from "react-router-dom";
import { useLoginStatus } from "../auth/PrivateRoute";
import './Sidebar.scss';

const Sidebar = () => {

    const { loginStatus } = useLoginStatus();

    // 새로고침 버튼 클릭
    const handleRefreshClick = () => {
        window.location.reload();
    }

    // 위로 버튼
    const handleToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 아래로 버튼
    const handleToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }



    return (

        <div className="main-sidebar">
            <ul>
                {/* 새로고침 아이콘 */}
                <li>
                    <span className="material-symbols-outlined sidebar-refresh" onClick={handleRefreshClick}>
                        refresh
                    </span>
                    <div className="hover-text">
                        <span>새로고침</span>
                    </div>
                </li>

                {/* 로그인 돼 있으면 마이페이지, 로그아웃 표시 */}
                {loginStatus ? (
                    <>
                        <li>
                            <Link to="/user/mypage">
                                <span className="material-symbols-outlined sidebar-mypage">
                                    person
                                </span>
                            </Link>
                            <div className="hover-text">
                                <span>마이페이지</span>
                            </div>
                        </li>
                        <li>
                            <Link to="/user/logout">
                                <span className="material-symbols-outlined sidebar-logout">
                                    logout
                                </span>
                            </Link>
                            <div className="hover-text">
                                <span>로그아웃</span>
                            </div>
                        </li>
                    </>
                ) : (
                    // 비로그인 상태면 로그인 버튼 표시
                    <li>
                        <Link to="/user/login">
                            <span className="material-symbols-outlined sidebar-login">
                                login
                            </span>
                        </Link>
                        <div className="hover-text">
                            <span>로그인</span>
                        </div>
                    </li>
                )}

                {/* 위로 아이콘 */}
                <li>
                    <span className="material-symbols-outlined sidebar-up-arrow" onClick={handleToTop}>
                        stat_1
                    </span>
                    <div className="hover-text">
                        <span>위로</span>
                    </div>
                </li>

                {/* 아래로 아이콘 */}
                <li>
                    <span className="material-symbols-outlined sidebar-down-arrow" onClick={handleToBottom}>
                        stat_minus_1
                    </span>
                    <div className="hover-text">
                        <span>아래로</span>
                    </div>
                </li>
            </ul>
        </div >
    )
}

export default Sidebar