import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import { Link } from "react-router-dom";
import API_URL from "../../../api/baseAPI";
import "./product_management.css";

const ProductManagement = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const user_cre = state.userAPI.userID[0];
  console.log("444444444444:", user_cre);
  const [products, setProducts] = state.productsAPI.products ?? [];
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [isCheck, setIsCheck] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(0);

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
  }, [state.token, products, token, acceptedCount]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice(
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
      window.location.reload();
      alert("Product delete successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const checkAll = () => {
    products?.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = async () => {
    try {
      setLoading(true);
      let newAcceptedCount = acceptedCount;
      for (const product of products) {
        if (product.checked === true) {
          newAcceptedCount -= 1;
          setAcceptedCount(newAcceptedCount);
          await axios.delete(`${API_URL}/api/products/${product._id}`, {
            headers: { Authorization: token },
          });
        }
      }
      if (newAcceptedCount === 0) {
        window.location.reload();
        alert("All Product delete successfully");
      }
      setCallback(!callback);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleCheck = (id) => {
    let newAcceptedCount = acceptedCount;
    products.forEach((product) => {
      if (product._id === id) {
        product.checked = !product.checked;
        if (product.checked === true) {
          newAcceptedCount += 1;
          setAcceptedCount(newAcceptedCount);
        } else {
          newAcceptedCount -= 1;
          setAcceptedCount(newAcceptedCount);
        }
      }
    });

    setProducts([...products]);
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = products.filter((product) => {
    return (
      getSellerName(product.user_cre)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const userProducts = filteredItems.filter(
    (product) => product.user_cre === user_cre
  );

  return (
    <div className="dashboard">
      <div className="container-fluid mt-3">
        <div className="row justify-content-center ">
          <div className="row justify-content-center">
            <div className="col-md-8 ">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">Tổng doanh thu</div>
                <div className="card-body">
                  <h5 className="card-title">$2,456</h5>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-white bg-info mb-3">
                <div className="card-header">Tổng số đơn đặt hàng</div>
                <div className="card-body">
                  <h5 className="card-title">1,326</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            {userProducts.length === 0 ? (
              <div>Không có sản phẩm</div>
            ) : (
              <div>
                <div className="button-container">
                  <div className="button-group">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={deleteAll}
                    >
                      Xoá hết
                    </button>
                    <div className="checkbox-all">
                      <input
                        type="checkbox"
                        className="small-checkbox"
                        checked={isCheck}
                        onChange={checkAll}
                      />
                    </div>
                  </div>
                </div>
                <table className="table table-striped table-sm mt-2">
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Tiêu đề bài đăng</th>
                      <th>Số lượng</th>
                      <th>Loại sản phẩm</th>
                      <th>Giá</th>
                      <th>Trạng thái</th>
                      <th>Ngày đăng</th>
                      <th>Chi tiết</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{getSellerName(product.user_cre)}</td>
                        <td>{product.title}</td>
                        <td>
                          {product.types && product.types.length > 0
                            ? product.types[0].amount
                            : "0"}
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
                        <td>
                          {product.amount === 0
                            ? "Đã bán hết"
                            : product.role === 1
                            ? "Đã duyệt"
                            : "Chờ duyệt"}
                        </td>
                        <td>{formatDate(product.createdAt)}</td>
                        <td>
                          <Link to={`/detail/${product._id}`}>Xem</Link>
                        </td>
                        <td className="action-buttons">
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
                        <td className="action-checkbox">
                          <input
                            type="checkbox"
                            className="small-checkbox"
                            checked={product.checked}
                            onChange={() => handleCheck(product._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
