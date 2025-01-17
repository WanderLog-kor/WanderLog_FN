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

        <aside className="main-sidebar">
            <ul>

                {/* 새로고침 아이콘 */}
                <li>
                    <span className="material-symbols-outlined sidebar-refresh" onClick={handleRefreshClick}>
                        refresh
                    </span>
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
                        </li>
                        <li>
                            <Link to="/user/logout">
                                <span className="material-symbols-outlined sidebar-logout">
                                    logout
                                </span>
                            </Link>
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
                    </li>
                )}

                {/* 위로 아이콘 */}
                <li>
                    <span className="material-symbols-outlined sidebar-up-arrow" onClick={handleToTop}>
                        stat_1
                    </span>
                </li>

                {/* 아래로 아이콘 */}
                <li>
                    <span className="material-symbols-outlined sidebar-down-arrow" onClick={handleToBottom}>
                        stat_minus_1
                    </span>
                </li>
            </ul>
        </aside >
    )
}

export default Sidebar