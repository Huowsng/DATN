import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';

function OrderDetails() {
    const state = useContext(GlobalState);
    //console.log(state)
    const [history] = state.userAPI.history;

    const [review, setReview] = state.orderAPI.reviews;

    const [orderDetails, setOrderDetails] = useState([]);
    const [isAdmin] = state.userAPI.isAdmin;
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            history.forEach((item) => {
                if (item._id === params.id) {
                    setOrderDetails(item);
                    setReview(item.listOrderItems);
                }
                //console.log(item);
            });
        }
    }, [params.id, history]);

    if (orderDetails.length === 0) return null;
    //const product_id = orderDetails.listOrderItems[0].product_id;
    //console.log(product_id)
    const product = orderDetails.listOrderItems;
    console.log(product);
    return (
        <div className="history-page">
            {isAdmin ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>名前</th>
                                <th>アドレス</th>
                                <th>電話番号</th>
                                <th>ステータス</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{orderDetails.user_id}</td>
                                <td>{orderDetails.address}</td>
                                <td>{orderDetails.phone}</td>
                                <td>{orderDetails.status}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ margin: '30px 0px' }}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>プロダックト</th>
                                <th>数量</th>
                                <th>値段</th>
                                <th>種類</th>
                                <th>レビュー</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.listOrderItems.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <img src={item.image} alt="" />
                                    </td>
                                    <td>{item.product_name}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.type_name}</td>
                                    <td>$ {item.price}</td>
                                    {isAdmin ? (
                                        <td>
                                            <Link to={`/detail/${item.product_id}`}>ユーザーレビューを見る</Link>
                                        </td>
                                    ) : (
                                        <td>
                                            <Link to={`/comment/${item.product_id}`}>レビュー</Link>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <table style={{ margin: '30px 0px' }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>プロダックト</th>
                            <th>数量</th>
                            <th>値段</th>
                            <th>種類</th>
                            <th>レビュー</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.listOrderItems.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <img src={item.image} alt="" />
                                </td>
                                <td>{item.product_name}</td>
                                <td>{item.amount}</td>
                                <td>{item.type_name}</td>
                                <td>$ {item.price}</td>
                                {isAdmin ? (
                                    <td>
                                        <Link to={`/detail/${item.product_id}`}>ユーザーレビューを見る</Link>
                                    </td>
                                ) : (
                                    <td>
                                        <Link to={`/comment/${item.product_id}`}>レビュー</Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default OrderDetails;
