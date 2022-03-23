import React, { useEffect, useState } from "react";
import { Table, Pagination, Select, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCinema,
  deleteCinema,
  editCinema,
  getCinemaByValue,
  getCinemas,
} from "../../services/cinema.service";
import { itemsPerPage } from "../../services/const";
import { error, success } from "../notification/notification";
import { NotNull } from "../element/not-null.component";

export function CinemasComponent() {
  const [listCinemas, setListCinemas] = useState([]);
  const [meta, setMeta] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState(null);
  const [keywordChange, setKeywordChange] = useState(null);
  const { Option } = Select;

  useEffect(() => {
    async function fetchData() {
      const query = { limit, page, keyword };
      getCinemas(query)
        .then((rs) => {
          setListCinemas(rs.data.items);
          setMeta(rs.data.meta);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [limit, page, keyword]);

  const navigate = useNavigate();
  const columns = [
    {
      title: "Tên rạp",
      dataIndex: "name",
      key: "name",
      render: (text, cinema) => (
        <a onClick={() => navigate(`../rap-chieu/${cinema.value}`)}>{text}</a>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tổng số phòng",
      dataIndex: "roomCount",
      key: "roomCount",
    },
  ];

  const data = listCinemas;

  const handleAddCinema = () => {
    navigate("../rap-chieu/them-moi");
  };

  return (
    <div>
      <div className=" d-flex justify-content-between mb-4">
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
          onClick={() => handleAddCinema()}
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
            showTotal={(total) => `Tổng số ${total} rạp chiếu`}
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

export function CinemaForm() {
  const [handleAdd, setHandleAdd] = useState(false);
  const [cinema, setCinema] = useState(null);
  const [id, setId] = useState(false);
  const [value, setValue] = useState(null);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [saved, setSaved] = useState(false);
  const params = useParams();
  const { action } = params;

  useEffect(() => {
    if (action === "them-moi") {
      setHandleAdd(true);
    } else {
      setHandleAdd(false);
      getCinemaByValue(action)
        .then((rs) => setCinema(rs.data))
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    setId(cinema?.id);
    setValue(cinema?.value);
    setName(cinema?.name);
    setAddress(cinema?.address);
    setImageUrl(cinema?.imageUrl);
  }, [cinema]);

  const navigate = useNavigate();

  const handleExit = () => {
    navigate("../rap-chieu");
  };

  const handleSaveCinema = () => {
    setSaved(true);
    const cinemaCreate = { value, name, address, imageUrl };
    if ((value, name, address)) {
      if (handleAdd) {
        createCinema(cinemaCreate)
          .then(() => {
            success("Thêm rạp chiếu thành công");
          })
          .catch(() => {
            error("Thêm rạp chiếu thất bại");
          });
      } else {
        editCinema(cinema.id, cinemaCreate)
          .then(() => success("Chỉnh sửa rạp chiếu thành công"))
          .catch(() => {
            error("Chỉnh sửa rạp chiếu thất bại");
          });
      }
    }
  };

  useEffect(() => {
    setSaved(false);
  }, [value, name, address]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOk = () => {
    deleteCinema(id)
      .then(() => {
        success("Xoá rạp chiếu thành công");
        handleExit();
      })
      .catch(() => {
        error("Xoá rạp chiếu thất bại");
      });
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <div className="form-movie">
        {handleAdd && (
          <div className="text-label-action">Thêm mới rạp chiếu</div>
        )}
        {!handleAdd && (
          <div className="text-label-action">Chỉnh sửa rạp chiếu</div>
        )}
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
              <span className="text-label">Tên rạp *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
                {saved && !name && <NotNull field="Tên rạp" />}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Địa chỉ *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></input>
                {saved && !address && <NotNull field="Địa chỉ" />}
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex mb-3">
          <span className="text-label">Link ảnh *:</span>
          <div className="img-url">
            <input
              className="ant-input input-box-custom"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            ></input>
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
              onClick={() => handleSaveCinema()}
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
        <h5>Xác nhận xoá rạp chiếu</h5>
        <p>Bạn có chắc chắn xoá vĩnh viễn rạp chiếu này</p>
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
