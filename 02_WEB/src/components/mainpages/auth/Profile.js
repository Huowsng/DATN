import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';

const Profile = () => {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [user] = state.userAPI.detail;
    console.log(user);
    console.log(token);

    // Sử dụng useState để theo dõi giá trị nhập liệu
    const [firstName, setFirstName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState(user.address);
    const [email, setEmail] = useState(user.email);

    // Xử lý sự kiện khi người dùng thay đổi giá trị
    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handlePhoneChange = (e) => setPhone(e.target.value);
    const handleAddressChange = (e) => setAddress(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);

    // Xử lý sự kiện khi người dùng nhấn nút "Lưu thay đổi"
    const handleSaveChanges = (e) => {
        e.preventDefault();

        // Gọi hàm hoặc API để lưu các giá trị đã thay đổi
        // Ví dụ: saveUserData(firstName, phone, address, email);
        console.log('Saving changes:', { firstName, phone, address, email });
    };

    return (
        <>
            <div className="body-information">
                <form>
                    <div className="name-information">
                        <div className="firstname-information">
                            <label className="label-information">名前</label>
                            <input
                                type="text"
                                id="fname"
                                name="firstname"
                                value={firstName}
                                onChange={handleFirstNameChange}
                            />
                        </div>
                    </div>
                    <label className="label-information">電話番号</label>
                    <input type="text" id="phone" name="phonenumber" value={phone} onChange={handlePhoneChange} />
                    {
                        //<label className="label-information">Address*</label>
                        //<input type="text" id="address" name="address" value={address} onChange={handleAddressChange} />
                    }
                    <label className="label-information">メールアドレス</label>
                    <input type="text" id="email" name="email" value={email} onChange={handleEmailChange} />
                    <button
                        type="submit"
                        className="btn-submit"
                        onClick={handleSaveChanges}
                        name="save_account_details"
                        value="Save changes"
                    >
                        Save changes
                    </button>
                </form>
            </div>
        </>
    );
};

export default Profile;
