import "./service.css";
import { BsPlusCircle } from "react-icons/bs";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../../GlobalState";
import ProductItem from "../../utils/productItem/ProductItem";
import Loading from "../../utils/loading/Loading";
import axios from "axios";
import LoadMore from "../../products/LoadMore";
import API_URL from "../../../../api/baseAPI";

const PRODUCTS_PER_PAGE = 20; // 5 rows * 4 columns

export const Service = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products ?? [];
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
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
      alert("Product deleted successfully");
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
      alert("Product role updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  const BrowserAll = () => {
    products.forEach((product) => {
      if (product.checked) {
        browserProduct(product._id);
      }
    });
  };

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

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
          <button onClick={BrowserAll}>Duyệt tất cả</button>
          <button onClick={deleteAll}>Xoá hết</button>
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
            className="service-product-item" // Add this line
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
      {products.length === 0 && <Loading />}
    </>
  );
};
