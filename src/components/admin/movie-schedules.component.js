import React, { useEffect, useState } from "react";
import {
  DatePicker,
  TimePicker,
  Select,
  Table,
  Pagination,
  Checkbox,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { SeatModel } from "../../models/seat.model";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  closeMovieSchedule,
  createMovieSchedule,
  getMovieSchedule,
  getMovieSchedules,
  openMovieSchedule,
} from "../../services/movie_schedule.service";
import { getAllCinemas } from "../../services/cinema.service";
import { getAllRoomsByCinema } from "../../services/room.service";
import { getAllMovies } from "../../services/movie.service";
import { getAllSeatsByRoom } from "../../services/seats.service";
import { itemsPerPage } from "../../services/const";
import { error, success } from "../notification/notification";

export function MovieSchedulesComponent() {
  const { Option } = Select;
  const [cinemaId, setCinemaId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [movieId, setMovieId] = useState(null);
  const [date, setDate] = useState(null);
  const [cinemasSelect, setCinemasSelect] = useState([]);
  const [roomsSelect, setRoomsSelect] = useState([]);
  const [moviesSelect, setMoviesSelect] = useState([]);
  const [listMovieSchedules, setListMovieSchedule] = useState([]);
  const [meta, setMeta] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      await getAllCinemas()
        .then((rs) => setCinemasSelect(rs.data))
        .catch((err) => console.log(err));
      await getAllMovies()
        .then((rs) => setMoviesSelect(rs.data))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getAllRoomsByCinema(cinemaId)
        .then((rs) => setRoomsSelect(rs.data))
        .catch((err) => console.log(err));
      const query = { cinemaId, roomId, movieId, date, limit, page };
      await getMovieSchedules(query)
        .then((rs) => setListMovieSchedule(rs.data.items))
        .catch((err) => console.log(err));
    }
    if (cinemaId) {
      fetchData();
    }
  }, [cinemaId]);

  useEffect(() => {
    async function fetchData() {
      const query = { cinemaId, roomId, movieId, limit, page };
      if (date) {
        query.date = moment(date).format("YYYY-MM-DD");
      }
      await getMovieSchedules(query)
        .then((rs) => {
          setListMovieSchedule(rs.data.items);
          setMeta(rs.data.meta);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [roomId, movieId, date, limit, page]);

  const columns = [
    {
      title: "Rạp",
      dataIndex: ["room", "cinema", "name"],
      key: "cinema",
      render: (text, schedule) => (
        <a
          onClick={() => navigate(`../rap-chieu/${schedule.room.cinema.value}`)}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Phòng",
      dataIndex: ["room", "name"],
      key: "room",
      render: (text, schedule) => (
        <a onClick={() => navigate(`../phong-chieu/${schedule.room.value}`)}>
          {text}
        </a>
      ),
    },
    {
      title: "Phim",
      dataIndex: ["movie", "name"],
      key: "movie",
      render: (text, schedule) => (
        <a onClick={() => navigate(`../phim/${schedule.movie.value}`)}>
          {text}
        </a>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
    },
    {
      title: "Suất",
      dataIndex: "time",
      key: "time",
      render: (text, schedule) => (
        <a onClick={() => navigate(`../lich-chieu/${schedule.id}`)}>{text}</a>
      ),
    },
  ];

  const data = listMovieSchedules;

  const handleAddMovieSchedule = () => {
    navigate("../lich-chieu/them-moi");
  };
  return (
    <div>
      <div className=" d-flex justify-content-between mb-4">
        <div className="d-flex">
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
          <div className="h-32px ml-5px">
            <Select
              className={"select-cinema"}
              showSearch
              placeholder="Chọn một phòng chiếu"
              optionFilterProp="children"
              onChange={(id) => setRoomId(id)}
            >
              {roomsSelect.map((room) => {
                return (
                  <Option className={"h-32px"} key={room.value} value={room.id}>
                    {room.name}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className="h-32px ml-5px">
            <Select
              className={"select-cinema"}
              showSearch
              placeholder="Chọn một phim"
              optionFilterProp="children"
              onChange={(id) => setMovieId(id)}
            >
              {moviesSelect.map((movie) => {
                return (
                  <Option
                    className={"h-32px"}
                    key={movie.value}
                    value={movie.id}
                  >
                    {movie.name}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className="h-32px ml-5px">
            <DatePicker
              className={"datepicker-custom-width"}
              onChange={(date) => setDate(date)}
              value={date}
            />
          </div>
        </div>
        <div
          className="button-add-custom text-center cursor-pointer"
          onClick={() => handleAddMovieSchedule()}
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
            showTotal={(total) => `Tổng số ${total} lịch chiếu`}
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

export function MovieScheduleForm() {
  const [handleAdd, setHandleAdd] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [cinemasSelect, setCinemasSelect] = useState([]);
  const [roomsSelect, setRoomsSelect] = useState([]);
  const [moviesSelect, setMoviesSelect] = useState([]);
  const [cinemaId, setCinemaId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [room, setRoom] = useState(null);
  const [movieId, setMovieId] = useState(null);
  const [id, setId] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [price, setPrice] = useState(null);
  const [seatsStatus, setSeatsStatus] = useState([]);
  const [seats, setSeats] = useState([]);
  const [seatsSelected, setSeatsSelected] = useState([]);
  const [isOpened, setIsOpened] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const params = useParams();
  const { action } = params;

  useEffect(() => {
    async function fetchData() {
      await getAllCinemas()
        .then((rs) => setCinemasSelect(rs.data))
        .catch((err) => console.log(err));
      await getAllMovies()
        .then((rs) => setMoviesSelect(rs.data))
        .catch((err) => console.log(err));
    }
    fetchData();
    if (action === "them-moi") {
      setHandleAdd(true);
    } else {
      setHandleAdd(false);
      async function fetchData() {
        await getMovieSchedule(action)
          .then((rs) => setSchedule(rs.data))
          .catch((err) => console.log(err));
      }
      fetchData();
    }
  }, [refresh]);

  useEffect(() => {
    if (!handleAdd && seatsStatus) {
      let arr = [];
      for (const s of seatsStatus) {
        if (s.isAdded) arr.push(new SeatModel(s.col, s.row));
      }
      setSeatsSelected(arr);
    }
  }, [seatsStatus]);

  useEffect(() => {
    async function fetchData() {
      await getAllRoomsByCinema(cinemaId)
        .then((rs) => setRoomsSelect(rs.data))
        .catch((err) => console.log(err));
    }
    if (cinemaId) {
      fetchData();
    }
  }, [cinemaId]);

  useEffect(() => {
    async function fetchData() {
      await getAllSeatsByRoom(roomId)
        .then((rs) => {
          setSeats(rs.data.seats);
          setRoom(rs.data.room);
        })
        .catch((err) => console.log(err));
    }
    if (roomId) {
      fetchData();
      if (handleAdd) {
        if (selectAll) {
          const arr = [];
          for (const seat of seats) {
            arr.push({ col: seat.col, row: seat.row });
          }
          setSeatsSelected(arr);
        } else {
          setSeatsSelected([]);
        }
      }
    }
  }, [roomId, selectAll]);

  useEffect(() => {
    if (schedule) {
      setId(schedule.id);
      setIsOpened(schedule.isOpened);
      setCinemaId(schedule.room.cinema.id);
      setRoomId(schedule.room.id);
      setRoom(schedule.room);
      setMovieId(schedule.movie.id);
      setDate(moment(schedule.date));
      setTime(schedule.time);
      setMovieId(schedule.movie.id);
      setSeatsStatus(schedule.seatsStatus);
      setPrice(schedule.price);
      let arr = [];
      for (const s of seatsStatus) {
        if (s.isAdded) {
          arr.push(new SeatModel(s.col, s.row));
        }
      }
      setSeatsSelected(arr);
    }
  }, [schedule]);

  const navigate = useNavigate();

  const handleExit = () => {
    navigate("../lich-chieu");
  };

  const setPost = (x, y) => {
    const seat = checkOnSelect(x, y);
    if (seat) {
      setSeatsSelected(seatsSelected.filter((s) => s.col !== x || s.row !== y));
    } else {
      setSeatsSelected([...seatsSelected, new SeatModel(x, y)]);
    }
  };

  const checkPosition = (x, y) => {
    let listSeats = [];
    if (handleAdd) {
      listSeats = seats;
    } else {
      listSeats = seatsStatus;
    }
    const obj = listSeats.find((val) => val.col === x && val.row === y);
    return {
      success: obj ? true : false,
      data: obj || {},
    };
  };

  const checkOnSelect = (x, y) => {
    return seatsSelected.find((seat) => seat.col === x && seat.row === y);
  };

  const Seats = () => {
    const rows = new Array(room?.lengthRow).fill(1);
    const cols = new Array(room?.lengthCol).fill(2);

    return rows.map((valRow, row) => {
      return (
        <div className="row m-0 px-12">
          {cols.map((valCol, col) => {
            const { data, success } = checkPosition(col + 1, row + 1);
            return success ? (
              <div
                className={`col p-0 text-center seat d-flex justify-content-center flex-column cursor-pointer  ${
                  checkOnSelect(col + 1, row + 1) ? "highlight" : ""
                }
                ${
                  data?.isReserved && !handleAdd
                    ? "disable-seat"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (!data?.isReserved || handleAdd) setPost(col + 1, row + 1);
                }}
              >
                {col + 1}
              </div>
            ) : (
              <div className="col p-0 text-center seat-none d-flex justify-content-center flex-column"></div>
            );
          })}
        </div>
      );
    });
  };

  const onChangeDate = (value) => {
    if (moment(new Date()).isSameOrBefore(value, "date")) {
      setDate(value);
    }
  };
  const onChangeTime = (value) => {
    if (date) {
      const dateString = moment(date).format("YYYY-MM-DD");
      const check = moment(
        `${dateString} ${value}`,
        "YYYY-MM-DD HH:mm"
      ).isSameOrAfter(moment().add(2, "hour"));
      if (check) {
        setTime(value);
      }
    }
  };
  const handleSaveSchedule = () => {
    const movieScheduleSave = {
      seatsStatus: seatsSelected,
      price,
      movieId,
      roomId,
      date,
      time,
    };
    async function postData() {
      if (handleAdd) {
        await createMovieSchedule(movieScheduleSave)
          .then(() => {
            success("Thêm lịch chiếu thành công");
          })
          .catch((err) => {
            if (err.response.status === 409) {
              error("Vui lòng chọn phòng hoặc thời điểm khác");
            } else error("Thêm lịch chiếu thất bại");
          });
      }
    }
    postData();
  };

  const handleCloseSchedule = () => {
    closeMovieSchedule(id)
      .then(() => {
        success("Huỷ lịch chiếu thành công");
        setRefresh(!refresh);
      })
      .catch(() => error("Huỷ lịch chiếu thất bại"));
  };
  const handleOpenSchedule = () => {
    openMovieSchedule(id)
      .then(() => {
        success("Mở chiếu thành công");
        setRefresh(!refresh);
      })
      .catch(() => error("Mở chiếu thất bại"));
  };
  return (
    <div>
      <div className="form-movie">
        {handleAdd && (
          <div className="text-label-action">Thêm mới lịch chiếu</div>
        )}
        {!handleAdd && (
          <div className="text-label-action">Chỉnh sửa lịch chiếu</div>
        )}
        <div className="row">
          <div className="col">
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
                    onChange={(id) => setCinemaId(id)}
                  >
                    {cinemasSelect.map((c) => {
                      return (
                        <Option className={"h-32px"} key={c.value} value={c.id}>
                          {c.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Phòng chiếu*:</span>
              <div>
                {(handleAdd || roomId) && (
                  <Select
                    className={"select-cinema"}
                    showSearch
                    placeholder="Chọn một phòng chiếu"
                    optionFilterProp="children"
                    defaultValue={roomId}
                    onChange={(id) => setRoomId(id)}
                  >
                    {roomsSelect.map((room) => {
                      return (
                        <Option
                          className={"h-32px"}
                          key={room.value}
                          value={room.id}
                        >
                          {room.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Phim:</span>
              <div>
                {(handleAdd || movieId) && (
                  <Select
                    className={"select-cinema"}
                    showSearch
                    placeholder="Chọn một phim"
                    optionFilterProp="children"
                    defaultValue={movieId}
                    onChange={(id) => setMovieId(id)}
                  >
                    {moviesSelect.map((movie) => {
                      return (
                        <Option
                          className={"h-32px"}
                          key={movie.value}
                          value={movie.id}
                        >
                          {movie.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Ngày:</span>
              <div>
                <DatePicker
                  className={"datepicker-custom-width"}
                  onChange={(value) => onChangeDate(value)}
                  value={date}
                />
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Suất:</span>
              <div>
                {handleAdd && (
                  <TimePicker
                    format="HH:mm"
                    defaultValue={moment()}
                    value={moment(time || "00:00", "HH:mm")}
                    onChange={(time, timeString) => onChangeTime(timeString)}
                  />
                )}
                {!handleAdd && time && (
                  <TimePicker
                    format="HH:mm"
                    value={moment(time, "HH:mm")}
                    onChange={(time, timeString) => onChangeTime(timeString)}
                  />
                )}
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Giá:</span>
              <div>
                <input
                  className="ant-input input-box-custom"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="d-flex mb-3">
              <span className="text-label">Ghế:</span>
              <div className="img-url">
                {<Seats />}
                {handleAdd && (
                  <div className="mb-3">
                    <Checkbox
                      onChange={(value) => setSelectAll(value.target.checked)}
                    >
                      Chọn tất cả
                    </Checkbox>
                  </div>
                )}
                {!handleAdd && (
                  <div>
                    <div className="d-flex mb-3">
                      <div className="seat-can-select"></div>
                      <div className="mr-15">&nbsp; Ghế chưa mở bán</div>
                    </div>
                    <div className="d-flex mb-3">
                      <div className="seat-on-select"></div>
                      <div className="mr-15">&nbsp; Ghế đang bán</div>
                    </div>
                    <div className="d-flex mb-3">
                      <div className="seat-disable"></div>
                      <div className="mr-15">&nbsp; Ghế đã bán</div>
                    </div>
                  </div>
                )}
                {handleAdd && (
                  <div>
                    <div className="d-flex mb-3">
                      <div className="seat-can-select"></div>
                      <div className="mr-15">&nbsp; Ghế không bán</div>
                    </div>
                    <div className="d-flex mb-3">
                      <div className="seat-on-select"></div>
                      <div className="mr-15">&nbsp; Ghế được bán</div>
                    </div>
                  </div>
                )}
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
            {!handleAdd && isOpened && (
              <div
                className="button-delete-custom text-center cursor-pointer"
                onClick={() => handleCloseSchedule()}
              >
                Huỷ chiếu
              </div>
            )}
            {!handleAdd && !isOpened && (
              <div
                className="button-search-custom text-center cursor-pointer"
                onClick={() => handleOpenSchedule()}
              >
                Mở chiếu
              </div>
            )}
            {handleAdd && (
              <div
                className="button-search-custom text-center cursor-pointer"
                onClick={() => handleSaveSchedule()}
              >
                Lưu
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
