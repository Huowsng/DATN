import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "./baseAPI";

function ProductsAPI() {
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);
  const test = "aaaaaa";

  const getProductsWithRole1 = async () => {
    const res = await axios.get(
      `${API_URL}/api/products?limit=${
        page * 9
      }&${category}&${sort}&title[regex]=${search}&role=1`
    );
    setProducts(res.data.products);
    setResult(res.data.result);
  };

  const getProductsWithRole0 = async () => {
    const res = await axios.get(
      `${API_URL}/api/products?limit=${
        page * 9
      }&${category}&${sort}&title[regex]=${search}&role=0`
    );
    setProducts(res.data.products);
    setResult(res.data.result);
  };

  useEffect(() => {
    getProductsWithRole1(); // You can call either function here
  }, [callback, category, sort, search, page]);

  return {
    products: [products, setProducts],
    callback: [callback, setCallback],
    category: [category, setCategory],
    sort: [sort, setSort],
    search: [search, setSearch],
    page: [page, setPage],
    result: [result, setResult],
    getProductsWithRole1, // Expose the functions to use them outside
    getProductsWithRole0, // Expose the functions to use them outside
    test,
  };
}

export default ProductsAPI;
