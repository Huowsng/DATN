import React, { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import { FcApproval, FcHighPriority, FcLineChart } from 'react-icons/fc';
import axios from 'axios';
import LoadMore from '../products/LoadMore';
import Loading from '../utils/loading/Loading';
import ItemCorrect from './ItemCorrect';
import API_URL from '../../../api/baseAPI';

function OrderHistory() {
    const state = useContext(GlobalState);
    //console.log(state)
    const [history, setHistory] = state.userAPI.history;
    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;
    const [page, setPage] = useState(2);
    const [me, setMe] = useState();
    //const [myorder,setMyorder] = useState([])
    // useEffect(() => {
    //     (async ()=>{
    //         const res = await axios.get(
    //             '/api/orders',
    //             {
    //               headers: { Authorization: token },
    //             }
    //         );
    //         //console.log(res.data)
    //     })()
    // },[token])

    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    const res = await axios.get(`${API_URL}/api/orders/admin?limit=${page * 9}`, {
                        headers: { Authorization: token },
                    });
                    setHistory(res.data);
                    // console.log(res.data);
                } else {
                    const res = await axios.get(`${API_URL}/api/orders`, {
                        headers: { Authorization: token },
                    });
                    // console.log(res.data);
                    setHistory(res.data);
                }
            };
            getHistory();
        }
    }, [token, isAdmin, setHistory]);

    return (
        <div className="history-page">
            <h2>{isAdmin ? 'Tất cả Đơn hàng' : 'My Order'}</h2>

            <h4>{history.length} Đơn hàng</h4>
            {isAdmin ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>ID Thanh Toán</th>
                                <th>Ngày mua</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Trạng thái</th>
                                <th>Vận chuyển</th>
                                <th>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((items) => {
                                return <ItemCorrect key={items._id} item={items} />;
                            })}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                {/* <th>Item</th> */}
                                <th>Ngày mua</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Status</th>
                                <th>Delivery</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((items) => (
                                <tr key={items._id}>
                                    {/* <td>{items._id}</td> */}
                                    <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                                    <td>{items.address}</td>
                                    <td>{items.phone}</td>
                                    <td>{items.status}</td>
                                    <td>
                                        {items.delivery == null ? (
                                            <img
                                                className="img-correct"
                                                src="https://cdn-icons-png.flaticon.com/128/2972/2972531.png"
                                                alt=""
                                            />
                                        ) : (
                                            <img
                                                className="img-correct"
                                                src="https://cdn-icons-png.flaticon.com/128/8888/8888205.png"
                                                alt=""
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/history/${items._id}`}>Xem</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {history.length === 0 && <Loading />}
        </div>
    );
}

export default OrderHistory;
