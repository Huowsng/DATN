import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import API_URL from "../../../api/baseAPI";

const initialState = {
  title: "",
  description: "",
  category: "",
  _id: "",
  role: 0,
};

let nextId = 0;
function CreateProduct() {
  const state = useContext(GlobalState);
  const user_cre = state.userAPI.userID[0];
  console.log("ìnorrrrrr:", user_cre);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  console.log("sôsos", token);

  const history = useNavigate();
  const param = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [amount, setMount] = useState();
  const [types, setTypes] = useState([]);

  const [products] = state.productsAPI.products;
  const [onEdit, setOnEdit] = useState(true);
  const [callback, setCallback] = state.productsAPI.callback;
  // console.log(JSON.stringify(product.types[0].name))
  const [edit, setEdit] = useState({
    title: "",
    description: "",
    category: "",
    _id: "",
    types: [
      {
        name: "",
        price: 0,
        amount: 0,
      },
    ],
  });
  useEffect(() => {
    if (param.id) {
      console.log("11111", products);
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === param.id) {
          console.log(product);
          setEdit(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [param.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      // if (!isAdmin) return alert('You are not admin');
      const file = e.target.files[0];

      if (!file) return alert("The file is not correct.");

      if (file.size > 1024 * 1024)
        // 1mb
        return alert("Image is large. Please try again");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        // 1mb
        return alert("The file is not correct.Please check again ");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      // if (!isAdmin) return alert('you not admin');
      setLoading(true);
      await axios.post(
        `${API_URL}/api/destroy`,
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  const handleChangeInputEdit = (e, index) => {
    const { name, value } = e.target;
    const updatedTypes = [...edit.types];
    updatedTypes[index] = { ...updatedTypes[index], [name]: value };
    setEdit({ ...edit, types: updatedTypes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const re = [];
      for (const test of types) {
        var obj = {
          name: test.name,
          price: test.price,
          amount: test.amount,
        };
        // console.log(test);
        re.push(obj);
        //setOrderItem(obj);
      }
      const rs = {
        title: product.title,
        description: product.description,
        category: product.category,
        types: re,
        role: isAdmin ? 1 : 0,
      };
      if (!images) return alert("image not upload");

      if (onEdit) {
        await axios.put(
          `${API_URL}/api/products/${product._id}`,
          { ...edit, images },
          {
            headers: { Authorization: token },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/api/products`,
          { ...rs, images, user_cre },
          {
            headers: { Authorization: token },
          }
        );
      }

      setCallback(!callback);
      history("/products");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  const styleUpload = {
    display: images ? "block" : "none",
  };
  console.log(edit);

  return (
    <div className="create_product">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {loading ? (
          <div id="file_img" className="no-line">
            <Loading />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>
      {onEdit ? (
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="categories">Categories: </label>
            <select
              name="category"
              value={edit.category || ""}
              onChange={handleChangeInputEdit}
            >
              <option>Danh mục tin đăng</option>
              {categories.map((category) => (
                <option value={category._id || ""} key={category._id}>
                  {category.name || ""}
                </option>
              ))}
            </select>
          </div>
          <div className="row">
            <label htmlFor="title">Edit product</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={edit.title}
              onChange={handleChangeInputEdit}
              // disabled={onEdit}
            />
          </div>
          <label htmlFor="title">Types</label>

          {edit.types.map((item, index) => {
            return (
              <div className="row-type" key={index}>
                <div>
                  <label>Tiêu đề của sản phẩm</label>
                  <input
                    type="text"
                    name="name"
                    value={item.name || ""}
                    onChange={(e) => handleChangeInputEdit(e, index)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="text"
                    name="price"
                    value={item.price || ""}
                    onChange={(e) => handleChangeInputEdit(e, index)}
                  />
                </div>
                <div>
                  <label>Amount</label>
                  <input
                    type="text"
                    name="amount"
                    value={item.amount || ""}
                    onChange={(e) => handleChangeInputEdit(e, index)}
                  />
                </div>
              </div>
            );
          })}

          <div className="row">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              required
              value={edit.description || ""}
              rows="5"
              onChange={handleChangeInputEdit}
            />
          </div>

          <button type="submit">{onEdit ? "Edit" : "Create"}</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="categories">Danh mục: </label>
            <select
              className="category"
              name="category"
              value={product.category}
              onChange={handleChangeInput}
            >
              <option value="">Danh mục tin đăng</option>
              {categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="row">
            <label htmlFor="title">Tiêu đề của sản phẩm</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={product.title}
              onChange={handleChangeInput}
              disabled={onEdit}
            />
          </div>
          <div className="row-type">
            <div>
              <input
                type="text"
                name="types"
                id="types"
                placeholder="Loại"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                name="price"
                id="price"
                placeholder="Giá"
                // required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                name="amount"
                id="amount"
                placeholder="Số lượng"
                // required
                value={amount}
                onChange={(e) => setMount(e.target.value)}
              />
            </div>
            <p id="output"></p>
            <button
              type="button"
              onClick={() => {
                setName("");
                setPrice("");
                setMount("");
                types.push({
                  id: nextId++,
                  name: name,
                  price: parseInt(price),
                  amount: parseInt(amount),
                });
                setTypes(types);
              }}
            >
              Add
            </button>
            <ul>
              {types.map((artist) => (
                <li key={artist.id}>
                  name :{artist.name} , price: {artist.price} , amount:
                  {artist.amount}{" "}
                  <button
                    onClick={() => {
                      setTypes(types.filter((a) => a.id !== artist.id));
                    }}
                  >
                    <AiOutlineCloseCircle />
                  </button>
                </li>
              ))}
            </ul>
            <ul>
              <li>{product.type}</li>
            </ul>
          </div>
          <div className="row">
            <label htmlFor="description">Mô tả chi tiết</label>
            <textarea
              type="text"
              name="description"
              id="description"
              placeholder="Thông tin chi tiết của sản phẩm:
                            - Nhã hiệu, xuất xứ
                            - Tình trạng sản phẩm
                            - Kích thước
                            - Địa chỉ, thông tin liên hệ
                            - Chính sách bảo hành"
              required
              value={product.description}
              rows="10"
              onChange={handleChangeInput}
            />
          </div>

          <button type="submit">{onEdit ? "Edit" : "Create"}</button>
        </form>
      )}
    </div>
  );
}

export default CreateProduct;
