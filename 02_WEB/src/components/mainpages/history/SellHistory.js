import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import Loading from "../utils/loading/Loading";
import ItemCorrect from "./ItemCorrect";
import API_URL from "../../../api/baseAPI";
import Pagination from "../products/pagination";

function SellHistory() {
  const state = useContext(GlobalState);
  const [allOrder, setAllOrder] = state.orderAPI.allOrder;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [orderDetails, setOrderDetails] = useState([]);
  // Nhận product_id từ URL
  const product_id = useParams();
  useEffect(() => {
    if (product_id && allOrder.length > 0) {
      const filteredOrders = [];
      allOrder.forEach((order) => {
        order.listOrderItems.forEach((item) => {
          if (item.product_id === product_id.id) {
            filteredOrders.push(order);
          }
        });
      });
      setOrderDetails(filteredOrders);
    }
  }, [product_id, allOrder]);
  // Lọc các đơn hàng có product_id tương ứng

  // Tính toán tổng số trang dựa trên số lượng các mục đã lọc
  const totalPages = Math.ceil(orderDetails.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const currentItems = orderDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="history-page">
      <h2>{isAdmin ? "Tất cả Đơn hàng" : "Đơn hàng của tôi"}</h2>
      <h4>{currentItems.length} Đơn hàng</h4>
      {currentItems.length > 0 ? (
        isAdmin ? (
          <table>
            <thead>
              <tr>
                <th>ID Thanh Toán</th>
                <th>Ngày mua</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Vận chuyển</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((items) => (
                <ItemCorrect key={items._id} item={items} />
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Ngày mua</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Vận chuyển</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((items) => (
                <tr key={items._id}>
                  <td>{items.listOrderItems[0].product_name}</td>
                  <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                  <td>{items.address}</td>
                  <td>{items.phone}</td>
                  <td>
                    {items.status === "Pending"
                      ? "Đang xử lý"
                      : items.status === "Paid"
                      ? "Đã thanh toán"
                      : items.status}
                  </td>
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
        )
      ) : (
        <Loading />
      )}
      {orderDetails.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default SellHistory;
