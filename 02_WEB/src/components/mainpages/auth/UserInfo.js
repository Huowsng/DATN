import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import { gsap } from 'gsap';
import axios from 'axios';

function UserInfo() {
    const state = useContext(GlobalState);
    const [isAdmin] = state.userAPI.isAdmin;

    const onEnter = ({ currentTarget }) => {
        gsap.to(currentTarget, {
            repeatDelay: 1,
            yoyo: true,
            scale: 1.3,
        });
    };
    const onLeave = ({ currentTarget }) => {
        gsap.to(currentTarget, { scale: 1 });
    };

    const logoutUser = async () => {
        await axios.get('/user/logout');
        localStorage.removeItem('firstLogin');
        window.location.href = '/';
    };
    return (
        <>
            {isAdmin ? (
                <div className="container-information">
                    <div className="header-information">
                        <p className="header-label">Admin</p>
                        <div className="header-direction">
                            <Link to="/">Trang chủ /</Link>
                            <Link to="/infor">マネージャー</Link>
                        </div>
                    </div>

                    <div className="detail-user-box">
                        <div className="user-box">
                            <p onMouseEnter={onEnter} onMouseLeave={onLeave}>
                                <Link to="/profile">Thông tin cá nhân</Link>
                            </p>
                        </div>
                    </div>
                    <div className="detail-user-box">
                        <div className="user-box">
                            <p onMouseEnter={onEnter} onMouseLeave={onLeave}>
                                <Link to="/history">すべてのĐơn hàng</Link>
                            </p>
                        </div>
                    </div>

                    <div className="detail-user-box">
                        <div className="user-box">
                            <p onMouseEnter={onEnter} onMouseLeave={onLeave}>
                                <Link to="/create_product">クリエート プロダクト</Link>
                            </p>
                        </div>
                    </div>
                    <div className="detail-user-box">
                        <div className="user-box">
                            <p onMouseEnter={onEnter} onMouseLeave={onLeave}>
                                <Link to="/category">クリエートカテゴリ</Link>
                            </p>
                        </div>
                    </div>
                    <div className="detail-user-box">
                        <div className="user-box">
                            <p onMouseEnter={onEnter} onMouseLeave={onLeave}>
                                <Link to="/" onClick={logoutUser}>
                                    Đăng xuất
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container-information">
                    <div className="header-information">
                        <p className="header-label">Chi tiết tài khoản</p>
                        <div className="header-direction">
                            <Link to="/">Trang chủ /</Link>
                            <Link to="/infor">Tài khoản</Link>
                        </div>
                    </div>

                    <div className="detail-user-box">
                        <div className="user-box">
                            <p onMouseEnter={onEnter} onMouseLeave={onLeave}>
                                <Link to="/profile">Thông tin cá nhân</Link>
                            </p>
                        </div>
                    </div>
                    <div className="detail-user-box">
                        <div className="user-box">
                            <p onMouseEnter={onEnter} onMouseLeave={onLeave}>
                                <Link to="/cart">Giỏ hàng</Link>
                            </p>
                        </div>
                    </div>
                    <div className="detail-user-box">
                        <div className="user-box">
                            <p onMouseEnter={onEnter} onMouseLeave={onLeave}>
                                <Link to="/" onClick={logoutUser}>
                                    Đăng xuất
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserInfo;
