import { Checkbox } from "antd";
import React, { useState, useEffect } from "react";
import { getMe } from "../../services/auth.service";
import { changePassword, updateProfile } from "../../services/users.service";
import { NotNull } from "../element/not-null.component";
import { error, success } from "../notification/notification";
import "./body.css";

export default function ProfileComponent() {
  const [me, setMe] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const [changePass, setChangePass] = useState(false);
  const [changeProfile, setChangeProfile] = useState(false);
  const [password, setPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordAgain, setNewPasswordAgain] = useState(null);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPassword, setSavedPassword] = useState(false);
  useEffect(() => {
    async function fetchData() {
      await getMe().then((rs) => {
        const data = rs.data;
        setMe(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    setSavedProfile(false);
  }, [name, phone, address]);
  useEffect(() => {
    setSavedPassword(false);
  }, [password, newPassword, newPasswordAgain]);

  const handleSaveProfile = () => {
    setSavedProfile(true);
    if (name && phone && address) {
      updateProfile({ name, phone, address })
        .then(() => success("Cập nhật thông tin thành công"))
        .catch(() => error("Cập nhật thông tin thất bại"));
      setChangeProfile(false);
    }
  };
  const handleChangePassword = () => {
    setSavedPassword(true);
    if (
      password &&
      newPassword &&
      newPasswordAgain &&
      newPassword === newPasswordAgain
    ) {
      changePassword({ password, newPassword })
        .then(() => success("Thay đổi mật khẩu thành công"))
        .catch(() => error("Thay đổi mật khẩu thất bại"));
      setChangePass(false);
    }
  };
  return (
    me && (
      <div className="container">
        <div className="row mt-3">
          <h5 className="title">Thông tin cá nhân</h5>
          <div className="col-6">
            <div className="mb-3">
              <span className="text-label mb-2">Email *:</span>
              <div className="input-disable">
                <span className="ml-10px">{email}</span>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-label mb-2">Họ và tên *:</span>
              {changeProfile && (
                <div>
                  <input
                    className="ant-input input-box-custom"
                    type={"text"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                  {!name && savedProfile && <NotNull field="Tên" />}
                </div>
              )}
              {!changeProfile && (
                <div className="input-disable">
                  <span className="ml-10px">{name}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <span className="text-label mb-2">Số điện thoại *:</span>
              {changeProfile && (
                <div>
                  <input
                    className="ant-input input-box-custom"
                    type={"tel"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  ></input>
                  {!phone && savedProfile && <NotNull field="Số điện thoại" />}
                </div>
              )}
              {!changeProfile && (
                <div className="input-disable">
                  <span className="ml-10px">{phone}</span>
                </div>
              )}
            </div>
            <div className="mb-4">
              <span className="text-label mb-2">Địa chỉ:</span>
              {changeProfile && (
                <div>
                  <input
                    className="ant-input input-box-custom"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></input>
                </div>
              )}
              {!changeProfile && (
                <div className="input-disable">
                  <span className="ml-10px">{address}</span>
                </div>
              )}
            </div>
            {!changeProfile && (
              <div
                className="button-search-custom text-center cursor-pointer w-25 ml-0"
                onClick={() => setChangeProfile(true)}
              >
                Chỉnh sửa thông tin
              </div>
            )}
            {changeProfile && (
              <div className="d-flex">
                <div
                  className="button-exit-custom text-center cursor-pointer w-15 ml-0"
                  onClick={() => setChangeProfile(false)}
                >
                  Thoát
                </div>
                <div
                  className="button-search-custom text-center cursor-pointer w-15"
                  onClick={() => handleSaveProfile()}
                >
                  Lưu
                </div>
              </div>
            )}
          </div>
          <div className="col-6">
            <div className="mt-2">
              <Checkbox
                onChange={(value) => setChangePass(value.target.checked)}
              >
                Đổi mật khẩu
              </Checkbox>
            </div>
            {changePass && (
              <div>
                <div className="mb-4">
                  <span className="text-label mb-2">Mật khẩu cũ *:</span>
                  <div>
                    <input
                      className="ant-input input-box-custom"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                    ></input>
                    {!password && savedPassword && (
                      <NotNull field="Mật khẩu cũ" />
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-label mb-2">Mật khẩu mới *:</span>
                  <div>
                    <input
                      className="ant-input input-box-custom"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                    ></input>
                    {!newPassword && savedPassword && (
                      <NotNull field="Mật khẩu mới" />
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-label mb-2">Nhập lại mật khẩu *:</span>
                  <div>
                    <input
                      className="ant-input input-box-custom"
                      value={newPasswordAgain}
                      type="password"
                      onChange={(e) => setNewPasswordAgain(e.target.value)}
                    ></input>
                    {!newPasswordAgain && savedPassword && (
                      <div className="p-0 not-null">Nhập lại mật khẩu</div>
                    )}
                    {newPasswordAgain &&
                      newPassword &&
                      newPassword !== newPasswordAgain &&
                      savedPassword && (
                        <div className="p-0 not-null">
                          Mật khẩu không trùng khớp
                        </div>
                      )}
                  </div>
                </div>
                <div
                  className="button-search-custom text-center cursor-pointer w-20 ml-0"
                  onClick={() => handleChangePassword()}
                >
                  Lưu mật khẩu
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}
