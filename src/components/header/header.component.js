import React, { useEffect, useState } from "react";

import { Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./header.css";
import { Input, Menu, Dropdown } from "antd";
import "antd/dist/antd.min.css";
import LoginComponent from "./modal/login/login.component";
import { getMe, logout } from "../../services/auth.service";
import { UserOutlined } from "@ant-design/icons";
import { Role } from "../../services/const";

export function HeaderComponent(props) {
  const { showModalLogin, setShowModalLogin } = props;
  const [me, setMe] = useState(null);
  const onSearch = (value) => console.log(value);
  const { Search } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    showModalLogin && showModal();
  }, [showModalLogin]);
  useEffect(() => {
    getMe().then((rs) => setMe(rs.data));
  }, [isLogin]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleLoginOk = () => {
    setIsModalVisible(false);
    setShowModalLogin(false);
    setIsLogin(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setShowModalLogin(false);
  };

  const handleLogOut = () => {
    setIsLogin(false);
    setMe(null);
    logout();
  };

  const menu = (
    <Menu>
      {me?.role === Role.CUSTOMER && (
        <Menu.Item key="0">
          <a href="/trang-ca-nhan">Cá nhân</a>
        </Menu.Item>
      )}
      {me?.role === Role.ADMIN && (
        <Menu.Item key="1">
          <a href="/admin">admin</a>
        </Menu.Item>
      )}
      <Menu.Item key="2">
        <a onClick={() => handleLogOut()} href="/">
          Đăng xuất
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Container>
        <div className="headerController d-flex justify-content-between">
          <div>
            <a href="/">
              <img
                src={window.location.origin + "/movie-ticket.png"}
                alt="Galaxy cinema"
                className="logo"
              />
            </a>
          </div>
          <div className="equalLogo">
            <div>
              <div className="headerSearch">
                <Search onSearch={onSearch} style={{ width: 250 }} />
              </div>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <div className="headerAuth">
              {!me && (
                <div className="loginLink" onClick={showModal}>
                  Đăng nhập
                </div>
              )}
              {me && (
                <div className="loginLink d-flex">
                  <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    className="d-flex"
                  >
                    <div
                      className="ant-dropdown-link cursor-pointer"
                      onClick={(e) => e.preventDefault()}
                    >
                      <UserOutlined />
                      <div className="ml-5px">{me.name}</div>
                    </div>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
      <div className="menuBackgroundColor">
        <Container className="menuPadding">
          <Row
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 15 }}
          >
            <Col>
              <a className="headerItem" href="/lich-chieu">
                MUA VÉ
              </a>
            </Col>
            <Col>
              <a className="headerItem" href="/phim">
                PHIM
              </a>
            </Col>
            <Col>
              <a className="headerItem" href="/goc-dien-anh">
                GÓC ĐIỆN ẢNH
              </a>
            </Col>
            <Col>
              <a className="headerItem" href="/rap-gia-ve">
                RẠP/ GIÁ VÉ
              </a>
            </Col>
            <Col>
              <a className="headerItem" href="/lich-su-mua-ve">
                LỊCH SỬ MUA VÉ
              </a>
            </Col>
          </Row>
        </Container>
      </div>

      <LoginComponent
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        showModal={showModal}
        handleCancel={handleCancel}
        handleLoginOk={handleLoginOk}
      />
    </div>
  );
}
