import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TiStarburst } from 'react-icons/ti';
import classNames from 'classnames/bind';
import styles from './NLogin.module.scss';
import API_URL from '../../../api/baseAPI';

const cx = classNames.bind(styles);

function NLogin() {
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/user/login`, { ...user });

            localStorage.setItem('firstLogin', true);

            window.location.href = '/';
        } catch (err) {
            alert('Login failed. Invalid email or password');
            console.log({ err });
        }
    };
    const style = {
        marginRight: '10px',
        color: {
            color: 'rgba(255,255,255)',
        },
    };

    return (
        <div className={cx('login-page')}>
            <form onSubmit={loginSubmit} className={cx('register-form')}>
                <h2>Đăng nhập</h2>
                <div className={cx('input-info')}>
                    <div className={cx('info-name')}>
                        <p className={cx('info-label')}>Tài khoản</p>
                        <TiStarburst color="red" fontSize="7pt" />
                    </div>
                    <input type="email" name="email" required value={user.email} onChange={onChangeInput} />
                </div>
                <div className={cx('input-info')}>
                    <div className={cx('info-name')}>
                        <p className={cx('info-label')}>Mật khẩu</p>
                        <TiStarburst color="red" fontSize="7pt" />
                    </div>
                    <input type="password" name="password" required value={user.password} onChange={onChangeInput} />
                </div>
                <div className={cx('row')}>
                    <button type="submit">Đăng nhập</button>
                    <Link to="/nregister" className={cx('login-btn')}>
                        Đăng kí
                    </Link>
                </div>
                <hr />
                <img
                    style={style}
                    src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                    alt="ig"
                    width="30"
                    height="30"
                />
                <img
                    style={style}
                    src="https://cdn-icons-png.flaticon.com/512/3670/3670032.png"
                    alt="ig"
                    width="30"
                    height="30"
                />
                <img
                    style={style}
                    src="https://cdn-icons-png.flaticon.com/512/888/888853.png"
                    alt="ig"
                    width="30"
                    height="30"
                />
                <img
                    style={style}
                    src="https://cdn-icons-png.flaticon.com/512/2504/2504839.png"
                    alt="ig"
                    width="30"
                    height="30"
                />
            </form>
        </div>
    );
}

export default NLogin;
