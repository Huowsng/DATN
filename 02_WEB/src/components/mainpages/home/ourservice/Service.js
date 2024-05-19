import "./service.css";
import { BsPlusCircle } from "react-icons/bs";
import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../../GlobalState";
import ProductItem from "../../utils/productItem/ProductItem";
import Loading from "../../utils/loading/Loading";
import axios from "axios";
import LoadMore from "../../products/LoadMore";
import API_URL from "../../../../api/baseAPI";

const PRODUCTS_PER_PAGE = 20; // 5 hàng * 4 cột

export const Service = () => {
  const state = useContext(GlobalState);
  const [productRole1, setProductRole1] = state.productsAPI.productRole1 ?? [];
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCheck = (id) => {
    productRole1.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProductRole1([...productRole1]);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post(
        `${API_URL}/api/destroy`,
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      const deleteProduct = axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;
      await deleteProduct;
      setCallback(!callback);
      alert("Xóa sản phẩm thành công");
    } catch (err) {
      console.log(err);
    }
  };

  const browserProduct = async (id) => {
    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/api/products/${id}`,
        { role: 1 },
        {
          headers: { Authorization: token },
        }
      );
      setCallback(!callback);
      alert("Cập nhật vai trò sản phẩm thành công");
    } catch (err) {
      console.log(err);
    }
  };

  const checkAll = () => {
    productRole1.forEach((product) => {
      product.checked = !isCheck;
    });
    setProductRole1([...productRole1]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    productRole1.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  const BrowserAll = () => {
    productRole1.forEach((product) => {
      if (product.checked) {
        browserProduct(product._id);
      }
    });
  };

  // Sort products by createdAt date in descending order
  const sortedProducts = [...productRole1].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  if (loading) return <Loading />;

  return (
    <>
      <div className="service-main">
        <div className="service-top">
          <p className="service-p">Tin đăng mới</p>
        </div>
      </div>

      {isAdmin && (
        <div className="delete-all">
          <span>Chọn Tất cả </span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Xóa hết</button>
        </div>
      )}

      <div className="services">
        {currentProducts.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            isAdmin={isAdmin}
            deleteProduct={deleteProduct}
            handleCheck={handleCheck}
            className="service-product-item" // Thêm dòng này
          />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <LoadMore />
      {productRole1.length === 0 && <Loading />}
    </>
  );
};
