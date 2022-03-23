import React, { useEffect, useState } from "react";
import { Table, Select, Pagination, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  createRoom,
  deleteRoom,
  editRoom,
  getRoomByValue,
  getRoomsByCinema,
} from "../../services/room.service";
import { itemsPerPage } from "../../services/const";
import { success, error } from "../notification/notification";
import { getAllCinemas } from "../../services/cinema.service";
import { NotNull } from "../element/not-null.component";

export function RoomsComponent() {
  const [cinemaId, setCinemaId] = useState(null);
  const [cinemasSelect, setCinemasSelect] = useState([]);
  const [keyword, setKeyword] = useState(null);
  const [listRooms, setListRooms] = useState([]);
  const [meta, setMeta] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [keywordChange, setKeywordChange] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      await getAllCinemas()
        .then((rs) => setCinemasSelect(rs.data))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (cinemaId) {
      async function fetchData() {
        const pagination = { limit, page, keyword };
        await getRoomsByCinema(cinemaId, pagination)
          .then((rs) => {
            setListRooms(rs.data.items);
            setMeta(rs.data.meta);
          })
          .catch((err) => console.log(err));
      }
      fetchData();
    }
  }, [cinemaId, limit, page, keyword]);

  const columns = [
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
      render: (text, room) => (
        <a onClick={() => navigate(`../phong-chieu/${room.value}`)}>{text}</a>
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Chiều dài",
      dataIndex: "lengthRow",
      key: "lengthRow",
    },
    {
      title: "Chiều rộng",
      dataIndex: "lengthCol",
      key: "lengthCol",
    },
    {
      title: "Tổng số ghế",
      dataIndex: "seatCount",
      key: "seatCount",
    },
  ];

  const data = listRooms;
  const { Option } = Select;

  const handleAddRoom = () => {
    navigate("../phong-chieu/them-moi");
  };

  return (
    <div>
      <div className=" d-flex justify-content-between mb-4">
        <div className="h-32px">
          <Select
            className={"select-cinema"}
            showSearch
            placeholder="Chọn một rạp chiếu"
            optionFilterProp="children"
            onChange={(id) => setCinemaId(id)}
          >
            {cinemasSelect.map((cinema) => {
              return (
                <Option
                  className={"h-32px"}
                  key={cinema.value}
                  value={cinema.id}
                >
                  {cinema.name}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="w-25">
          <div className="d-flex">
            <input
              type={"text"}
              placeholder="Tìm kiếm"
              className="ant-input input-box-custom"
              onChange={(e) => setKeywordChange(e.target.value)}
            />
            <div
              className="button-search-custom text-center cursor-pointer"
              onClick={() => setKeyword(keywordChange)}
            >
              Tìm
            </div>
          </div>
        </div>
        <div
          className="button-add-custom text-center cursor-pointer"
          onClick={() => handleAddRoom()}
        >
          <div className="d-flex justify-content-center">
            <PlusOutlined className="pr-3" />
            <span>Thêm mới</span>
          </div>
        </div>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} />
      <div>
        <div className="d-flex justify-content-end mt-2">
          <Pagination
            total={meta?.totalItems}
            defaultCurrent={page}
            defaultPageSize={limit}
            pageSize={limit}
            showTotal={(total) => `Tổng số ${total} phòng chiếu`}
            onChange={(page) => setPage(page)}
          />
          <div className="ml-10px">
            <Select
              className={"select-cinema"}
              showSearch
              placeholder="Số lượng"
              optionFilterProp="children"
              onChange={(value) => setLimit(value)}
            >
              {itemsPerPage.map((item) => {
                return (
                  <Option className={"h-32px"} key={item} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoomForm() {
  const [handleAdd, setHandleAdd] = useState(false);
  const [cinemasSelect, setCinemasSelect] = useState([]);
  const [room, setRoom] = useState(null);
  const [id, setId] = useState(null);
  const [cinemaId, setCinemaId] = useState(null);
  const [value, setValue] = useState(null);
  const [name, setName] = useState(null);
  const [position, setPosition] = useState(null);
  const [lengthCol, setLengthCol] = useState(null);
  const [lengthRow, setLengthRow] = useState(null);
  const [saved, setSaved] = useState(false);
  const params = useParams();
  const { action } = params;

  useEffect(() => {
    async function fetchData() {
      await getAllCinemas()
        .then((rs) => setCinemasSelect(rs.data))
        .catch((err) => console.log(err));
    }
    if (action === "them-moi") {
      setHandleAdd(true);
    } else {
      setHandleAdd(false);
      async function fetchData() {
        getRoomByValue(action)
          .then((rs) => setRoom(rs.data))
          .catch((err) => console.log(err));
      }
      fetchData();
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (room) {
      setCinemaId(room.cinema.id);
      setId(room.id);
      setValue(room.value);
      setName(room.name);
      setPosition(room.position);
      setLengthCol(room.lengthCol);
      setLengthRow(room.lengthRow);
    }
  }, [room]);

  useEffect(() => {
    setSaved(false);
  }, [value, name, cinemaId, lengthCol, lengthRow]);

  const navigate = useNavigate();

  const handleExit = () => {
    navigate("../phong-chieu");
  };
  const handleSaveRoom = () => {
    setSaved(true);
    const room = {
      value,
      cinemaId,
      name,
      position,
      lengthRow,
      lengthCol,
    };
    if (value && cinemaId && name && lengthRow && lengthCol) {
      if (handleAdd) {
        createRoom(room)
          .then(() => {
            success("Thêm phòng chiếu thành công");
          })
          .catch(() => {
            error("Thêm phòng chiếu thất bại");
          });
      } else {
        editRoom(id, room)
          .then(() => {
            success("Chỉnh sửa phòng chiếu thành công");
          })
          .catch(() => {
            error("Chỉnh sửa phòng chiếu thất bại");
          });
      }
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOk = () => {
    deleteRoom(id)
      .then(() => {
        success("Xoá phòng chiếu thành công");
        handleExit();
      })
      .catch(() => {
        error("Xoá phòng chiếu thất bại");
      });
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className="form-movie">
        {handleAdd && <div className="text-label-action">Thêm mới phòng</div>}
        {!handleAdd && <div className="text-label-action">Chỉnh sửa phòng</div>}
        <div className="row">
          <div className="col">
            <div className="d-flex mb-3">
              <span className="text-label">Id *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                ></input>
                {saved && !value && <NotNull field="Id" />}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Rạp chiếu *:</span>
              <div>
                {(handleAdd || cinemaId) && (
                  <Select
                    className={"select-cinema"}
                    showSearch
                    placeholder="Chọn một rạp chiếu"
                    optionFilterProp="children"
                    defaultValue={cinemaId}
                    onChange={(value) => setCinemaId(value)}
                  >
                    {cinemasSelect.map((cinema) => {
                      return (
                        <Option
                          className={"h-32px"}
                          key={cinema.value}
                          value={cinema.id}
                        >
                          {cinema.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
                {saved && !cinemaId && <NotNull field="Rạp chiếu" />}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Tên phòng *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
                {saved && !name && <NotNull field="Tên phòng" />}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Chiều dài *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={lengthRow}
                  type="number"
                  onChange={(e) => setLengthRow(e.target.value)}
                ></input>
                {saved && !lengthRow && <NotNull field="Chiều dài" />}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Chiều rộng *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={lengthCol}
                  type="number"
                  onChange={(e) => setLengthCol(e.target.value)}
                ></input>
                {saved && !lengthCol && <NotNull field="Chiều rộng" />}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Vị trí *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                ></input>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between mb-4">
          <div
            className="button-exit-custom text-center cursor-pointer"
            onClick={() => handleExit()}
          >
            Thoát
          </div>
          <div className="d-flex">
            {!handleAdd && (
              <div
                className="button-delete-custom text-center cursor-pointer"
                onClick={() => setIsModalVisible(true)}
              >
                Xoá
              </div>
            )}
            <div
              className="button-search-custom text-center cursor-pointer"
              onClick={() => handleSaveRoom()}
            >
              Lưu
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="abd"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h5>Xác nhận xoá phòng chiếu</h5>
        <p>Bạn có chắc chắn xoá vĩnh viễn phòng chiếu này</p>
        <div className="d-flex justify-content-end">
          <div
            className="button-exit-custom text-center cursor-pointer"
            onClick={() => handleCancel()}
          >
            Huỷ
          </div>
          <div
            className="button-delete-custom text-center cursor-pointer"
            onClick={() => handleOk()}
          >
            Xoá
          </div>
        </div>
      </Modal>
    </div>
  );
}
