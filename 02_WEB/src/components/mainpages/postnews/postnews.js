import { GlobalState } from "../../../GlobalState";
import React, { useContext, useEffect, useState } from "react";

function Postnews() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  console.log(products);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;

  return (
    <>
      <div className="main_postnew"></div>
    </>
  );
}

export default Postnews;
