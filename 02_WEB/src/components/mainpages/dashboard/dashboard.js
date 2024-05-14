import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import API_URL from "../../../api/baseAPI";
import ItemCorrect from "../history/ItemCorrect";
import "./dashboard.css";
import LoadMore from "../products/LoadMore";

const Dashboard = () => {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Tính toán tổng số trang
  const totalPages = Math.ceil(history.length / itemsPerPage);

  // Lấy dữ liệu của trang hiện tại
  const currentItems = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="dashboard">
      <div className="container-fluid mt-3">
        <div className="row">
          <aside className="col-md-2 bg-light sidebar">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Commerce
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Analytics
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Crypto
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Helpdesk
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Monitoring
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Fitness
                </a>
              </li>
            </ul>
          </aside>
          <main className="col-md-10 ml-sm-auto col-lg-10 px-4">
            <div className="row mb-3">
              <div className="col-md-3">
                <div className="card text-white bg-primary mb-3">
                  <div className="card-header">Total Sales</div>
                  <div className="card-body">
                    <h5 className="card-title">$2,456</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-warning mb-3">
                  <div className="card-header">Total Expenses</div>
                  <div className="card-body">
                    <h5 className="card-title">$3,326</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-success mb-3">
                  <div className="card-header">Total Visitors</div>
                  <div className="card-body">
                    <h5 className="card-title">5,325</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-info mb-3">
                  <div className="card-header">Total Orders</div>
                  <div className="card-body">
                    <h5 className="card-title">1,326</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              {history.length === 0 ? (
                <div>Không có sản phẩm</div>
              ) : (
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>ID Bài đăng</th>
                      <th>Ngày đăng</th>
                      <th>Người đăng</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Chi tiết</th>
                      <th>Accept/Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item._id}>
                        <td>{item.id}</td>
                        <td>{item.date}</td>
                        <td>{item.author}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.details}</td>
                        <td>
                          <button className="btn btn-sm btn-primary">
                            Edit
                          </button>
                          <button className="btn btn-sm btn-danger">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {history.length > 0 && (
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
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
                </ul>
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
