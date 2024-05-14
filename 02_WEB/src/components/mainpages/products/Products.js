import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import Loading from "../utils/loading/Loading";
import axios from "axios";
import Filters from "./Filters";
import LoadMore from "./LoadMore";
import { Link } from "react-router-dom";
import API_URL from "../../../api/baseAPI";

function Products() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products ?? [];
  console.log(products);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
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
      alert("Product deleted successfully2");
    } catch (err) {
      // alert(err.response.data.msg);
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

  const deleteAll = () => {
    products.forEach((product) => {
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
        {products?.map((product) => {
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
      {products?.length === 0 && <Loading />}
    </>
  );
}

export default Products;
