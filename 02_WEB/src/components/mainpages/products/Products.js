import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import Loading from "../utils/loading/Loading";
import axios from "axios";
import Filters from "./Filters";
import LoadMore from "./pagination";
import { Link } from "react-router-dom";
import API_URL from "../../../api/baseAPI";

function Products() {
  const state = useContext(GlobalState);
  const [productRole1, setProductRole1] = state.productsAPI.productRole1 ?? [];
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const handleCheck = (id) => {
    productRole1.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProductRole1([...productRole1]);
    console.log("do dai", productRole1.length);
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

  const checkAll = () => {
    productRole1?.forEach((product) => {
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

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <>
      <Filters />
      <div className="header-information">
        <p className="header-label">Cửa hàng</p>
        <div className="header-direction">
          <Link to="/">Trang chủ /</Link>
          <Link to="/products">Cửa hàng</Link>
        </div>
      </div>

      {isAdmin && (
        <div className="delete-all">
          <span>Chọn Tất cả </span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Xoá hết</button>
        </div>
      )}

      <div className="products">
        {productRole1?.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>
      <LoadMore />
      {productRole1?.length === 0 && <Loading />}
    </>
  );
}

export default Products;
