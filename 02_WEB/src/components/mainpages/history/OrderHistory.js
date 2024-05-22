import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../utils/loading/Loading";
import ItemCorrect from "./ItemCorrect";
import API_URL from "../../../api/baseAPI";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        const limit = 10;
        let res;
        if (isAdmin) {
          res = await axios.get(
            `${API_URL}/api/orders/admin?limit=${limit}&page=${page}`,
            {
              headers: { Authorization: token },
            }
          );
        } else {
          res = await axios.get(
            `${API_URL}/api/orders?limit=${limit}&page=${page}`,
            {
              headers: { Authorization: token },
            }
          );
        }
        setHistory(res.data);
      };
      getHistory();
    }
  }, [token, isAdmin, page, setHistory]);

  // Calculate total pages based on actual number of items
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const currentItems = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="history-page">
      <h2>{isAdmin ? "Tất cả Đơn hàng" : "My Order"}</h2>
      <h4>{history.length} Đơn hàng</h4>
      {history.length > 0 ? (
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
                <th>Ngày mua</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Status</th>
                <th>Delivery</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((items) => (
                <tr key={items._id}>
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
        )
      ) : (
        <Loading />
      )}
      {history.length > 0 && (
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link" href="#" onClick={handlePreviousPage}>
                Previous
              </a>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a className="page-link" href="#" onClick={handleNextPage}>
                Next
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default OrderHistory;
