import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { TiStarburst } from "react-icons/ti";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import API_URL from "../../../api/baseAPI";
import { FaFacebook, FaGoogle } from "react-icons/fa";

const cx = classNames.bind(styles);

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const users = await axios.post(`${API_URL}/user/login`, { ...user });
      console.log(users.data.accesstoken);
      localStorage.setItem("firstLogin", true);
      localStorage.setItem("accesstoken", users?.data?.accesstoken);

      window.location.href = "/";
    } catch (err) {
      alert("Login failed. Invalid email or password");
      console.log({ err });
    }
  };
  const style = {
    marginRight: "10px",
    color: {
      color: "rgba(255,255,255)",
    },
  };

  return (
    <section
      className="vh-100 main-login"
      style={{ backgroundColor: "#508bfc" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card shadow-2-strong"
              style={{
                border: "solid 3px #ffffff",
                borderRadius: "1rem",
                backgroundColor: "rgba(255, 255, 255,0.1)",
              }}
            >
              <div className="card-body p-5 text-center">
                <h3 className="mb-5 text-white" style={{ color: "#ffffff" }}>
                  Sign in
                </h3>

                <div
                  className="form-outline mb-4"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <input
                    type="email"
                    name="email"
                    id="typeEmailX-2"
                    placeholder="Email"
                    className="form-control form-control-lg"
                    value={user.email}
                    onChange={onChangeInput}
                  />
                </div>

                <div
                  className="form-outline mb-4"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="typePasswordX-2"
                    className="form-control form-control-lg"
                    value={user.password}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="form-check d-flex justify-content-start mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    // checked={rememberPassword}
                    // onChange={handleRememberPasswordChange}
                    id="form1Example3"
                  />
                  <label className="form-check-label" htmlFor="form1Example3">
                    {" "}
                    Remember password{" "}
                  </label>
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block"
                  type="submit"
                  onClick={loginSubmit}
                >
                  Login
                </button>

                <hr className="my-4" />

                <button
                  className="btn btn-lg btn-block btn-primary"
                  style={{ backgroundColor: "#dd4b39" }}
                  type="submit"
                >
                  <FaGoogle className="me-2" /> Sign in with google
                </button>
                <button
                  className="btn btn-lg btn-block btn-primary mb-2"
                  style={{ backgroundColor: "#3b5998" }}
                  type="submit"
                >
                  <FaFacebook className="me-2" />
                  Sign in with facebook
                </button>
                <div className="mt-3">
                  <p className="text-white mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-white fw-bold">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
