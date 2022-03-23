import { Menu } from "antd";
import React from "react";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { UsersComponent } from "./users.component";
import { CinemaForm, CinemasComponent } from "./cinemas.component";
import { RoomsComponent, RoomForm } from "./rooms.component";
import { SeatsComponent } from "./seats.component";
import {
  MovieScheduleForm,
  MovieSchedulesComponent,
} from "./movie-schedules.component";
import { MoviesComponent, MovieForm } from "./movies.component";
import { PaymentsComponent } from "./payment.component";
import "./admin.css";
import ProfileComponent from "../client/profile.component";

export default function AdminComponent() {
  const { SubMenu } = Menu;
  const params = useParams();
  const navigate = useNavigate();

  const { id } = params;
  const handleClick = (e) => {
    navigate(`../admin/${e.key}`);
  };
  return (
    <div className="p-3">
      <div className="row">
        <div className="col-2">
          <Menu
            className="menu"
            onClick={(value) => handleClick(value)}
            style={{ width: 256 }}
            defaultSelectedKeys={[`${id}`]}
            mode="inline"
          >
            <SubMenu
              key="authorization"
              icon={<UserOutlined />}
              title="Quản lý khách hàng"
            >
              <Menu.Item key="khach-hang">Khách hàng</Menu.Item>
              <Menu.Item key="thanh-toan">Thanh toán</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub1"
              icon={<SettingOutlined />}
              title="Quản lý rạp chiếu"
            >
              <Menu.Item key="rap-chieu">Rạp chiếu</Menu.Item>
              <Menu.Item key="phong-chieu">Phòng chiếu</Menu.Item>
              <Menu.Item key="ghe-ngoi">Ghế ngồi</Menu.Item>
              <Menu.Item key="phim">Phim</Menu.Item>
              <Menu.Item key="lich-chieu">Lịch chiếu</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-10">
          <Routes>
            <Route path="/" element={<ProfileComponent />} />
            <Route path="/khach-hang" element={<UsersComponent />} />
            <Route path="/thanh-toan" element={<PaymentsComponent />} />
            <Route path="/rap-chieu" element={<CinemasComponent />} />
            <Route path="/rap-chieu/:action" element={<CinemaForm />} />
            <Route path="/phong-chieu" element={<RoomsComponent />} />
            <Route path="/phong-chieu/:action" element={<RoomForm />} />
            <Route path="/ghe-ngoi" element={<SeatsComponent />} />
            <Route path="/phim" element={<MoviesComponent />} />
            <Route path="/phim/:action" element={<MovieForm />} />
            <Route path="/lich-chieu" element={<MovieSchedulesComponent />} />
            <Route path="/lich-chieu/:action" element={<MovieScheduleForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
