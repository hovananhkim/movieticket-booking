import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";
import "./login.css";
import "antd/dist/antd.min.css";
import { Modal, Tabs } from "antd";
import { login, register } from "../../../../services/auth.service";
import { error, success, warning } from "../../../notification/notification";
import { NotNull } from "../../../element/not-null.component";
import {
  forgetPasswordService,
  resetPasswordService,
} from "../../../../services/users.service";
const { TabPane } = Tabs;

export default function LoginComponent(props) {
  const { isModalVisible, handleCancel, handleLoginOk } = props;
  const [forgetPassword, setForgetPassword] = useState(false);
  const callback = (key) => {};

  const LoginForm = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [saved, setSaved] = useState(null);

    useEffect(() => {
      setSaved(false);
    }, [email, password]);

    const handleLogin = () => {
      setSaved(true);
      if (email && password) {
        login({ email, password })
          .then((rs) => {
            localStorage.setItem("accessToken", rs.data.accessToken);
            handleLoginOk();
          })
          .catch(() => error("Email hoặc mật khẩu không đúng"));
      }
    };
    return (
      <div className="login-form">
        <form className="py-2">
          <div className="row m-0 mb-3">
            <input
              type={"text"}
              placeholder="Email"
              className="ant-input  p-2"
              onChange={(e) => setEmail(e.target.value)}
            />
            {!email && saved && <NotNull field="Email" />}
          </div>
          <div className="row m-0 mb-3">
            <input
              type={"password"}
              placeholder="Mật khẩu"
              className="ant-input p-2 input-box-custom"
              onChange={(e) => setPassword(e.target.value)}
            />
            {!password && saved && (
              <div className="p-0 not-null">Mật khẩu không được trống</div>
            )}
          </div>
          <div className="row m-0">
            <a
              className="forgot-password p-0"
              onClick={() => setForgetPassword(true)}
            >
              Quên mật khẩu?
            </a>
          </div>
          <div className="row m-0 mt-4">
            <div
              className="button-login text-center cursor-pointer"
              onClick={() => handleLogin()}
            >
              Đăng nhập
            </div>
          </div>
        </form>
      </div>
    );
  };

  const ForgetPasswordForm = () => {
    const [email, setEmail] = useState(null);
    const [code, setCode] = useState(null);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [clickForgetPassword, setClickForgetPassword] = useState(false);
    const [clickResetPassword, setClickResetPassword] = useState(false);

    useEffect(() => {
      setClickResetPassword(false);
      setClickResetPassword(false);
    }, [email, code, password, newPassword]);

    const handleForgetPassword = () => {
      setClickForgetPassword(true);
      if (email) {
        forgetPasswordService({ email }).then(() =>
          success("Hãy kiểm tra email của bạn")
        );
      }
    };

    const handleResetPassword = () => {
      setClickResetPassword(true);
      if (
        email &&
        code &&
        password &&
        newPassword &&
        password === newPassword
      ) {
        resetPasswordService({ email, code, password })
          .then(() => success("Thay đổi mật khẩu thành công"))
          .catch((err) => {
            if (err.response.status === 404) {
              error("Mã xác nhận không tồn tại");
            }
            if (err.response.status === 400) {
              error("Mã xác nhận hết hạn");
            }
          });
      }
    };
    return (
      <div className="login-form">
        <form className="py-2">
          <div className="row m-0 mb-3">
            <div className="d-flex pl-0">
              <input
                type={"text"}
                placeholder="Email *"
                className="ant-input  p-2"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setClickForgetPassword(false);
                }}
              />
              <div
                className="button-search-custom text-center cursor-pointer w-50"
                onClick={() => handleForgetPassword()}
              >
                Gửi mã xác nhận
              </div>
            </div>

            {!email && (clickForgetPassword || clickResetPassword) && (
              <NotNull field="Email" />
            )}
          </div>
          <div className="row m-0 mb-3">
            <input
              type={"text"}
              placeholder="Mã xác nhận *"
              className="ant-input p-2 input-box-custom"
              onChange={(e) => setCode(e.target.value)}
            />
            {!code && clickResetPassword && (
              <div className="p-0 not-null">Mã xác nhận không được trống</div>
            )}
          </div>
          <div className="row m-0 mb-3">
            <input
              type={"password"}
              placeholder="Mật khẩu *"
              className="ant-input p-2 input-box-custom"
              onChange={(e) => setPassword(e.target.value)}
            />
            {!password && clickResetPassword && (
              <div className="p-0 not-null">Mật khẩu không được trống</div>
            )}
          </div>
          <div className="row m-0 mb-3">
            <input
              type={"password"}
              placeholder="Nhập lại mật khẩu"
              className="ant-input p-2 input-box-custom"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {!newPassword && clickResetPassword && (
              <div className="p-0 not-null">Nhập lại mật khẩu</div>
            )}
            {password &&
              newPassword &&
              newPassword !== password &&
              clickResetPassword && (
                <div className="p-0 not-null">Mật khẩu không trùng khớp</div>
              )}
          </div>
          <div className="row m-0">
            <a
              className="forgot-password p-0"
              onClick={() => setForgetPassword(false)}
            >
              Đăng nhập
            </a>
          </div>
          <div className="row m-0 mt-4">
            <div
              className="button-login text-center cursor-pointer"
              onClick={() => handleResetPassword()}
            >
              Thay đổi mật khẩu
            </div>
          </div>
        </form>
      </div>
    );
  };

  const RegisterForm = () => {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordAgain, setPasswordAgain] = useState(null);
    const [saved, setSaved] = useState(false);

    const handleRegister = () => {
      setSaved(true);
      if (name && email && phone && password && password === passwordAgain) {
        const userRegister = { name, email, password, phone, address };
        register(userRegister)
          .then(() => success("Đăng kí thành công"))
          .catch((err) => {
            if (err.response.status === 409) {
              warning("Email đã tồn tại");
            } else error("Đăng kí thất bại");
          });
      }
    };
    useEffect(() => {
      setSaved(false);
    }, [name, email, password, phone, passwordAgain]);

    return (
      <div className="login-form">
        <form className="py-2">
          <div className="row m-0 mb-3">
            <input
              type={"text"}
              placeholder="Họ và tên *"
              className="ant-input p-2"
              onChange={(e) => setName(e.target.value)}
            />
            {!name && saved && (
              <div className="p-0 not-null">Tên không được trống</div>
            )}
          </div>
          <div className="row m-0  mb-3">
            <div className="col-12 col-md-6 p-0 pr-5px">
              <input
                type={"text"}
                placeholder="Email *"
                className="ant-input p-2"
                onChange={(e) => setEmail(e.target.value)}
              />
              {!email && saved && (
                <div className="p-0 not-null">Email không được trống</div>
              )}
            </div>
            <div className="col-12 col-md-6 p-0 pl-5px">
              <input
                type={"tel"}
                placeholder="Số điện thoại *"
                className="ant-input p-2"
                onChange={(e) => setPhone(e.target.value)}
              />
              {!phone && saved && (
                <div className="p-0 not-null">
                  Số điện thoại không được trống
                </div>
              )}
            </div>
          </div>
          <div className="row m-0  mb-3">
            <div className="col-12 col-md-6 p-0 pr-5px">
              <input
                type={"password"}
                placeholder="Mật khẩu *"
                className="ant-input p-2"
                onChange={(e) => setPassword(e.target.value)}
              />
              {!password && saved && (
                <div className="p-0 not-null">Mật khẩu không được trống</div>
              )}
            </div>
            <div className="col-12 col-md-6 p-0 pl-5px">
              <input
                type={"password"}
                placeholder="Nhập lại mật khẩu *"
                className="ant-input p-2"
                onChange={(e) => setPasswordAgain(e.target.value)}
              />
              {!passwordAgain && saved && (
                <div className="p-0 not-null">Nhập lại mật khẩu </div>
              )}
              {password &&
                passwordAgain &&
                passwordAgain !== password &&
                saved && (
                  <div className="p-0 not-null">Mật khẩu không trùng khớp</div>
                )}
            </div>
          </div>
          <div className="row m-0  mb-3">
            <input
              type={"text"}
              placeholder="Địa chỉ"
              className="ant-input p-2"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="row m-0 mt-4">
            <div
              className="button-login text-center cursor-pointer"
              onClick={() => handleRegister()}
            >
              Đăng ký
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Modal title="Basic Modal" visible={isModalVisible} onCancel={handleCancel}>
      {!forgetPassword && (
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Đăng nhập" key="1">
            <LoginForm />
          </TabPane>
          <TabPane tab="Đăng ký" key="2">
            <RegisterForm />
          </TabPane>
        </Tabs>
      )}
      {forgetPassword && (
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Quên mật khẩu" key="1">
            <ForgetPasswordForm />
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
}
