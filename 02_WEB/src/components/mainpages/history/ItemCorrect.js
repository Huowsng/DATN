import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import API_URL from "../../../api/baseAPI";

const ItemCorrect = ({ item: initialItem }) => {
  const state = useContext(GlobalState);
  const [item, setItem] = useState(initialItem);
  const [token] = state.token;

  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  const confirm = async (id) => {
    if (item.delivery) {
      return alert("This order has been delivered.");
    }

    const delivery = window.prompt("Type delivery_Id");
    if (!delivery) {
      return alert("Delivery ID is required.");
    }

    const updatedItem = { ...item, delivery, status: "Confirmed" };
    setItem(updatedItem);

    const rs = {
      delivery_id: delivery,
      order_id: id,
    };

    if (window.confirm("Confirm this order?")) {
      try {
        await axios.put(`${API_URL}/api/delivery`, rs, {
          headers: { Authorization: token },
        });
        alert("This order has been confirmed");
      } catch (error) {
        alert("Failed to confirm order");
      }
    }
  };

  return (
    <tr key={item._id}>
      <td>{item._id}</td>
      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
      <td>{item.address}</td>
      <td>{item.phone}</td>
      <td>
        {item.status === "Pending"
          ? "Đang xử lý"
          : item.status === "Paid"
          ? "Đã thanh toán"
          : item.status}
      </td>
      <td>
        <button type="button" onClick={() => confirm(item._id)}>
          <img
            className="img-correct"
            src={
              item.delivery == null
                ? "https://cdn-icons-png.flaticon.com/128/7698/7698976.png"
                : "https://cdn-icons-png.flaticon.com/128/8888/8888205.png"
            }
            alt="Confirm Delivery"
          />
        </button>
      </td>
      <td>
        <Link to={`/history/${item._id}`}>Xem</Link>
      </td>
    </tr>
  );
};

export default ItemCorrect;
