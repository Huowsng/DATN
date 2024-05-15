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
  const [searchTerm, setSearchTerm] = useState("");
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
        const res = await axios.get(`${API_URL}/user/username`, {
          headers: { Authorization: token },
        });
        setUsers(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [state.token, productRole0, token]);

  const totalPages = Math.ceil(productRole0.length / itemsPerPage);
  const currentItems = productRole0.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: token },
      });
      setCallback(!callback);
      window.location.reload();
      alert("Product deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getSellerName = (userId) => {
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user.name;
    });
    const name = userMap[userId];
    return name ? name : "Unknown";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const acceptProduct = async (id) => {
    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/api/products/role/${id}`,
        { role: 1 },
        {
          headers: { Authorization: token },
        }
      );
      window.location.reload();
      alert("Product role updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = productRole0.filter((product) => {
    return (
      getSellerName(product.user_cre)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="dashboard">
      <div className="container-fluid mt-3">
        <div className="row">
          <main className="col-md-10 ml-sm-auto col-lg-10 px-4">
            <div className="row mb-3">{/* Your card section */}</div>
            <div className="row">
              <div className="col-md-12">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
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
                  {/* Your table header */}
                  <tbody>
                    {filteredItems.map((product) => (
                      <tr key={product._id}>
                        <td>{getSellerName(product.user_cre)}</td>
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
                        <td>
                          <Link to={`/detail/${product._id}`}>Xem</Link>
                        </td>
                        <td className="action-buttons">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => acceptProduct(product._id)}
                          >
                            Accept
                          </button>
                          <button className="btn btn-sm btn-primary">
                            <Link to={`/edit_product/${product._id}`}>
                              Edit
                            </Link>
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
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`page-link ${
                      currentPage === pageNumber ? "active" : ""
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
