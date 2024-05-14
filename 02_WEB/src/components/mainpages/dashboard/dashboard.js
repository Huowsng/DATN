import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import { Link } from "react-router-dom";
import API_URL from "../../../api/baseAPI";
import "./dashboard.css";

const Dashboard = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [productRole0, setProductRole0] = state.productsAPI.productRole0 ?? [];
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/category`);
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user`);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [state.token]);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(productRole0.length / itemsPerPage);

  // Lấy dữ liệu của trang hiện tại
  const currentItems = productRole0.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Xóa sản phẩm
  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post(
        `${API_URL}/api/destroy`,
        { public_id },
        {
          headers: { Authorization: state.token },
        }
      );
      const deleteProduct = axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: state.token },
      });
      await destroyImg;
      await deleteProduct;
      setCallback(!callback);
      alert("Product deleted successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  // Lấy tên danh mục từ id danh mục
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Lấy tên người bán từ id người bán
  const getSellerName = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Unknown";
  };

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const acceptProduct = async (id) => {
    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/api/products/${id}`,
        { role: 1 },
        {
          headers: { Authorization: token },
        }
      );
      window.location.reload();
      // setCallback(!callback);
      alert("Product role updated successfully");
    } catch (err) {
      console.log(err);
    }
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
              {productRole0.length === 0 ? (
                <div>Không có sản phẩm</div>
              ) : (
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>Tên người bán</th>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Loại</th>
                      <th>Giá</th>
                      <th>Ngày đăng</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((product) => (
                      <tr key={product._id}>
                        <td>{getSellerName(product.userId)}</td>
                        <td>{product.title}</td>
                        <td>
                          {product.types && product.types.length > 0
                            ? product.types[0].amount
                            : "N/A"}
                        </td>
                        <td>{getCategoryName(product.category)}</td>
                        <td>
                          {product.types && product.types.length > 0
                            ? product.types[0].price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })
                            : "N/A"}
                        </td>
                        <td>{formatDate(product.createdAt)}</td>
                        <td className="action-buttons">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => acceptProduct(product._id)}
                          >
                            Accept
                          </button>

                          <button className="btn btn-sm btn-primary">
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              deleteProduct(
                                product._id,
                                product.images.public_id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {productRole0.length > 0 && (
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
