import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";

const Profile = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [user] = state.userAPI.detail;

  const [firstName, setFirstName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [sex, setSex] = useState(user.sex);
  const [birthDate, setBirthDate] = useState(user.birthDate);

  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleGenderChange = (e) => setSex(e.target.value);
  const handleBirthDateChange = (e) => setBirthDate(e.target.value);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    console.log("Saving changes:", {
      firstName,
      phone,
      email,
      sex,
      birthDate,
    });
  };

  return (
    <>
      <div className="profile-container row">
        <div className="sidebar-profile">
          <div className="profile-header">
            <img src={user.avatar} alt="Avatar" className="profile-avatar" />
            <button className="edit-profile-btn">Sửa Hồ Sơ</button>
          </div>
          <ul className="sidebar-menu">
            <li>Hồ Sơ</li>
            <li>Ngân Hàng</li>
            <li>Địa Chỉ</li>
            <li>Đổi Mật Khẩu</li>
          </ul>
        </div>
        <div className="profile-content">
          <h2>Hồ Sơ Của Tôi</h2>
          <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
          <form onSubmit={handleSaveChanges}>
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                value={firstName}
                onChange={handleFirstNameChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <div>{email}</div>
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <div>{phone}</div>
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <div className="form-group-sex">
                <label>
                  <input
                    type="radio"
                    value="man"
                    checked={sex === "man"}
                    onChange={handleGenderChange}
                  />
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    value="girl"
                    checked={sex === "girl"}
                    onChange={handleGenderChange}
                  />
                  Nữ
                </label>
                <label>
                  <input
                    type="radio"
                    value="other"
                    checked={sex === "other"}
                    onChange={handleGenderChange}
                  />
                  Khác
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                value={birthDate}
                onChange={handleBirthDateChange}
              />
            </div>
            <button type="submit" className="btn-submit">
              Lưu
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
