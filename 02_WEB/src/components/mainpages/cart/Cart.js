import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import PaypalButton from "./PaypalButton";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Link } from "react-router-dom";
import API_URL from "../../../api/baseAPI";

function Cart() {
  const state = useContext(GlobalState);
  //console.log(state.userAPI);
  const [cart, setCart] = state.userAPI.cart;
  //const addOrder = state.orderAPI.order;
  const [token] = state.token;
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.types[0].price * item.quantity;
      }, 0);

      setTotal(total);
      //console.log("total" + total)
    };

    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    try {
      await axios.patch(
        `${API_URL}/user/addcart`,
        { cart },
        {
          headers: { Authorization: `${token}` },
        }
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart], () => {
      addToCart(cart);
    });
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete the product?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };

  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;

    //paypal
    await axios.post(
      `${API_URL}/api/payment`,
      { cart, paymentID, address },
      {
        headers: { Authorization: token },
      }
    );

    setCart([]);
    addToCart([]);
    alert("Your order has been successfully placed.");
  };
  // hom qua lam toi day
  const Checkout = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/orders/checkout`,
        { cart },
        {
          headers: { Authorization: token },
        }
      );
    } catch (error) {
      console.error("Error during checkout:", error);
      // Xử lý lỗi ở đây, ví dụ hiển thị thông báo cho người dùng hoặc thực hiện các hành động cần thiết.
    }
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "2rem" }}>No product </h2>
    );
  return (
    <div>
      <form onSubmit={Checkout}>
        {cart.map((product, type) => (
          <div className="detail cart" key={product._id}>
            <img src={product.images[0].url} alt="" />

            <div className="box-detail">
              <h2>{product.title}</h2>
              <h3>
                {" "}
                {product.types && product.types.length > 0
                  ? product.types[0].price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  : "N/A"}
              </h3>
              <p>{product.description}</p>
              <div className="amount">
                <button onClick={() => decrement(product._id)}> - </button>
                <span>{product.quantity}</span>
                <button onClick={() => increment(product._id)}> + </button>
              </div>
              <div
                className="delete"
                onClick={() => removeProduct(product._id)}
              >
                X
              </div>
            </div>
          </div>
        ))}

        <div className="total">
          <h3>
            Giá:{" "}
            {total > 0
              ? total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
              : "N/A"}
          </h3>
          <Link
            to="/checkout"
            className="checkout"
            onClick={() => {
              console.log(JSON.stringify(cart));
            }}
          >
            Tiến hành đặt hàng
          </Link>
        </div>
      </form>
    </div>
  );
}
// cart
export default Cart;
