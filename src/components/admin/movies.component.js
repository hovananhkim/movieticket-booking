import React, { useEffect, useState } from "react";
import { Table, DatePicker, Pagination, Select, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  createMovie,
  editMovie,
  getMovieByValue,
  getMovies,
  deleteMovie,
} from "../../services/movie.service";
import { itemsPerPage } from "../../services/const";
import { error, success } from "../notification/notification";

export function MoviesComponent() {
  const navigate = useNavigate();
  const [listMovies, setListMovies] = useState([]);
  const [meta, setMeta] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [keywordChange, setKeywordChange] = useState(null);
  const [keyword, setKeyword] = useState(null);

  const { Option } = Select;
  useEffect(() => {
    async function fetchData() {
      const query = { limit, page, keyword };
      getMovies(query)
        .then((rs) => {
          setListMovies(rs.data.items);
          setMeta(rs.data.meta);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [limit, page, keyword]);

  const columns = [
    {
      title: "Tên phim",
      dataIndex: "name",
      key: "name",
      render: (text, movie) => (
        <a onClick={() => navigate(`../phim/${movie.value}`)}>{text}</a>
      ),
    },
    {
      title: "Đaọ diễn",
      dataIndex: "director",
      key: "director",
    },
    {
      title: "Diễn viên",
      dataIndex: "casts",
      key: "casts",
    },
    {
      title: "Thể loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Quốc gia",
      dataIndex: "nation",
      key: "nation",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
  ];

  const data = listMovies;

  const handleAddMovie = () => {
    navigate("../phim/them-moi");
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
          onClick={() => handleAddMovie()}
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
            showTotal={(total) => `Tổng số ${total} phim`}
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

export function MovieForm() {
  const [handleAdd, setHandleAdd] = useState(false);
  const [movie, setMovie] = useState(null);
  const [id, setId] = useState(null);
  const [date, setDate] = useState(moment());
  const [value, setValue] = useState(null);
  const [name, setName] = useState(null);
  const [vietnamName, setVietNamName] = useState(null);
  const [time, setTime] = useState(null);
  const [type, setType] = useState(null);
  const [director, setDirector] = useState(null);
  const [producer, setProducer] = useState(null);
  const [nation, setNation] = useState(null);
  const [casts, setCasts] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [description, setDescription] = useState(null);

  const params = useParams();
  const { action } = params;

  useEffect(() => {
    if (action === "them-moi") {
      setHandleAdd(true);
    } else {
      setHandleAdd(false);
      getMovieByValue(action)
        .then((rs) => {
          setMovie(rs.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (movie) {
      setId(movie.id);
      setValue(movie.value);
      setName(movie.name);
      setVietNamName(movie.vietnamName);
      setDate(moment(movie.date, "YYYY-MM-DD"));
      setTime(movie.time);
      setType(movie.type);
      setDirector(movie.director);
      setProducer(movie.producer);
      setNation(movie.nation);
      setCasts(movie.casts);
      setImageUrl(movie.imageUrl);
      setTrailer(movie.trailer);
      setDescription(movie.description);
    }
  }, [movie]);

  const onChangeDate = (dateChange) => {
    setDate(dateChange);
  };
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("../phim");
  };

  const handleSaveMovie = () => {
    const movie = {
      value,
      name,
      vietnamName,
      type,
      producer,
      director,
      casts,
      nation,
      date,
      time,
      imageUrl,
      trailer,
      description,
    };
    if (handleAdd) {
      createMovie(movie)
        .then(() => {
          success("Thêm phim thành công");
        })
        .catch(() => {
          error("Thêm phim thất bại");
        });
    } else {
      editMovie(id, movie)
        .then(() => {
          success("Chỉnh sửa phim thành công");
        })
        .catch(() => {
          error("Chỉnh sửa phim thất bại");
        });
    }
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOk = () => {
    deleteMovie(id)
      .then(() => {
        success("Xoá phim thành công");
        handleExit();
      })
      .catch(() => {
        error("Xoá phim thất bại");
      });
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <div className="form-movie">
        {handleAdd && <div className="text-label-action">Thêm mới phim</div>}
        {!handleAdd && <div className="text-label-action">Chỉnh sửa phim</div>}
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
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Tên phim *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Tên tiếng việt:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={vietnamName}
                  onChange={(e) => setVietNamName(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Ngày *:</span>
              <DatePicker
                className={"datepicker-custom-width"}
                onChange={onChangeDate}
                value={date}
              />
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Thời gian *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                ></input>
              </div>
              <span className="text-label pl-5">phút</span>
            </div>
          </div>
          <div className="col">
            <div className="d-flex mb-3">
              <span className="text-label">Thể loại *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Đạo diễn *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Nhà sản xuất *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Quốc gia *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={nation}
                  onChange={(e) => setNation(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Diễn viên *:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={casts}
                  onChange={(e) => setCasts(e.target.value)}
                ></input>
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
        <div className="d-flex mb-3">
          <span className="text-label">Link trailer *:</span>
          <div className="img-url">
            <input
              className="ant-input input-box-custom"
              value={trailer}
              onChange={(e) => setTrailer(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="d-flex mb-3">
          <span className="text-label">Description *:</span>
          <div className="img-url">
            <textarea
              className="ant-input input-box-custom"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            ></textarea>
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
              onClick={() => handleSaveMovie()}
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
        <h5>Xác nhận xoá phim</h5>
        <p>Bạn có chắc chắn xoá vĩnh viễn phim này</p>
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
