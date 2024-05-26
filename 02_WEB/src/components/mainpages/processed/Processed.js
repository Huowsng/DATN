import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import "./processed.css";
import axios from "axios";
import Loading from "../utils/loading/Loading";
import API_URL from "../../../api/baseAPI";
import logo from "../../../asset/img/upload_img/logo_momo.png";

const Processed = () => {
  const state = useContext(GlobalState);
  const [process] = state.orderAPI.processed;
  const [token] = state.token;
  const [detail] = state.userAPI.detail;
  const [userDetail, setUserDetail] = useState([]);
  const [loading, setLoading] = useState(false);

  const history = useNavigate();
  const orderId = process._id;

  useEffect(() => {
    if (detail._id === process.user_id) {
      setUserDetail(detail);
    }
  }, [detail, process.user_id]);

  const tranSuccess = async (id) => {
    if (token) {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/cart/checkout`,
        { order_id: id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      window.open(res.data.url, "_blank");
      alert("Bạn đã đặt hàng thành công.");
      history("/history");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="processed">
      <div className="iphone">
        <div className="header">
          <h1>Payment</h1>
        </div>
        <div className="form">
          <div>
            <h2>Address</h2>
            <div className="card">
              <address>
                {detail._id === process.user_id ? (
                  <div>
                    <b>Name</b> : {detail.name}
                    <br />
                    <b>Email</b> : {detail.email}
                    <br />
                    <b>Address</b> : {process.address}
                    <br />
                    <b>Số điện thoại</b> : {process.phone}
                  </div>
                ) : (
                  <div>
                    <h1>Please checkout your order</h1>
                  </div>
                )}
              </address>
            </div>
          </div>
          <fieldset>
            <legend>Payment Method</legend>
            <div className="form__radios">
              <div className="form__radio">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
                  alt="Visa"
                  width="60"
                />
                <span>Thanh toán bằng Visa</span>
                <label htmlFor="visa">
                  <svg className="icon">
                    <use href="https://cdn-icons-png.flaticon.com/512/196/196566.png" />
                  </svg>
                </label>
                <input
                  defaultChecked
                  id="visa"
                  name="payment-method"
                  type="radio"
                />
              </div>
              <div className="form__radio">
                <img src={logo} alt="Momo" width="70" />
                <span>Thanh toán bằng Momo</span>
                <label htmlFor="momo">
                  <svg className="icon">
                    <use href="https://cdn-icons-png.flaticon.com/512/732/732223.png" />
                  </svg>
                </label>
                <input id="momo" name="payment-method" type="radio" />
              </div>

              <div className="form__radio">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/216/216486.png"
                  alt="Cash"
                  width="60"
                />
                <span>Thanh toán bằng tiền mặt</span>
                <label htmlFor="cash">
                  <svg className="icon">
                    <use href="https://cdn-icons-png.flaticon.com/512/216/216486.png" />
                  </svg>
                </label>
                <input id="cash" name="payment-method" type="radio" />
              </div>
            </div>
          </fieldset>

          <div className="process-table">
            <h2>Shopping Bill</h2>

            <table>
              <tbody>
                <tr>
                  <td>Free ship</td>
                  <td align="right">0 VND</td>
                </tr>
                <tr>
                  <td>Price Total</td>
                  <td align="right">{formatCurrency(process.total)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td align="right">{formatCurrency(process.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="btn-processed">
            <button
              className="button button--full"
              onClick={() => tranSuccess(orderId)}
            >
              <svg className="icon">
                <use href="#icon-shopping-bag" />
              </svg>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="process-information"></div>
    </div>
  );
};

export default Processed;
