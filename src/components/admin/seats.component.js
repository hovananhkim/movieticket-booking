import React, { useEffect, useState } from "react";
import { Checkbox, Select } from "antd";
import { SeatModel } from "../../models/seat.model";
import { getAllCinemas } from "../../services/cinema.service";
import { getAllRoomsByCinema } from "../../services/room.service";
import {
  createSeats,
  deleteSeats,
  getAllSeatsByRoom,
} from "../../services/seats.service";
import { success, warning } from "../notification/notification";

export function SeatsComponent() {
  const [cinemasSelect, setCinemasSelect] = useState([]);
  const [roomsSelect, setRoomsSelect] = useState([]);

  const [cinemaId, setCinemaId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [room, setRoom] = useState(null);
  const [listSeats, setListSeats] = useState([]);
  const [changedSeats, setChangedSeats] = useState(false);
  const { Option } = Select;
  const [seatsSelected, setSeatsSelected] = useState([]);
  const [reset, setReset] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await getAllCinemas()
        .then((rs) => setCinemasSelect(rs.data))
        .catch((err) => console.log(err));
      if (roomId) {
        await getAllSeatsByRoom(roomId)
          .then((rs) => {
            const { data } = rs;
            setListSeats(data.seats);
            setRoom(data.room);
          })
          .catch((err) => console.log(err));
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getAllRoomsByCinema(cinemaId)
        .then((rs) => setRoomsSelect(rs.data))
        .catch((err) => console.log(err));
    }
    setListSeats([]);
    setRoom(null);
    setRoomId(null);
    if (cinemaId) {
      fetchData();
    }
  }, [cinemaId]);

  useEffect(() => {
    async function fetchData() {
      await getAllSeatsByRoom(roomId)
        .then((rs) => {
          const { data } = rs;
          setListSeats(data.seats);
          setRoom(data.room);
        })
        .catch((err) => console.log(err));
    }
    if (roomId) {
      fetchData();
    }
  }, [roomId, changedSeats]);

  useEffect(() => {
    const arr = [];
    if (!selectAll) {
      for (const s of listSeats) {
        arr.push(new SeatModel(s.col, s.row));
      }
    } else {
      if (room) {
        const { lengthCol, lengthRow } = room;
        for (let col = 1; col <= lengthCol; col++) {
          for (let row = 1; row <= lengthRow; row++) {
            arr.push(new SeatModel(col, row));
          }
        }
      }
    }
    setSeatsSelected(arr);
  }, [listSeats, selectAll, room]);

  const handleSaveSeat = () => {
    let listNew = [...seatsSelected];
    let listOld = [...listSeats];
    for (let i = 0; i < listNew.length; i++) {
      let index = listOld.findIndex(
        (s) => s.col === listNew[i].col && s.row === listNew[i].row
      );
      if (index >= 0) {
        listOld.splice(index, 1);
        listNew.splice(i, 1);
        i--;
      }
    }
    if (listNew.length > 0) {
      const seatsCreate = { seats: listNew, roomId };
      createSeats(seatsCreate)
        .then(() => {
          setChangedSeats(!changedSeats);
          if (listOld.length > 0) {
            const seatsDelete = { seats: listOld, roomId };
            deleteSeats(seatsDelete)
              .then(() => {
                success("Chỉnh sửa ghế thành công");
                setChangedSeats(!changedSeats);
              })
              .catch(() => {});
          } else {
            success("Thêm ghế thành công");
          }
        })
        .catch(() => {});
    } else {
      if (listOld.length > 0) {
        const seatsDelete = { seats: listOld, roomId };
        deleteSeats(seatsDelete)
          .then(() => {
            success("Xoá ghế thành công");
            setChangedSeats(!changedSeats);
          })
          .catch(() => {});
      }
    }

    if (listNew.length + listOld.length === 0) {
      warning("Không có ghế nào thay đổi");
    }
  };

  const setPost = (col, row) => {
    const seat = checkOnSelect(col, row);
    if (seat) {
      setSeatsSelected(
        seatsSelected.filter((s) => s.col !== col || s.row !== row)
      );
    } else {
      setSeatsSelected([...seatsSelected, new SeatModel(col, row)]);
    }
  };

  const checkOnSelect = (col, row) => {
    return seatsSelected.find((seat) => seat.col === col && seat.row === row);
  };

  const Seats = () => {
    if (room) {
      const rows = new Array(room.lengthRow).fill(1);
      const cols = new Array(room.lengthCol).fill(2);
      return (
        <div className="mb-3">
          {rows.map((valRow, row) => {
            return (
              <div className="row m-0 px-12 justify-content-center">
                {cols.map((valCol, col) => {
                  return (
                    <div
                      className={`col p-0 text-center seat d-flex justify-content-center flex-column cursor-pointer ${
                        checkOnSelect(col + 1, row + 1) ? "highlight" : ""
                      }
                "cursor-pointer"}`}
                      onClick={() => {
                        setPost(col + 1, row + 1);
                      }}
                    >
                      {col + 1}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    } else return <div></div>;
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
              onChange={(value) => {
                setCinemaId(value);
              }}
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
              onChange={(value) => setRoomId(value)}
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
        </div>
        <div
          className="button-search-custom text-center cursor-pointer"
          onClick={() => handleSaveSeat()}
        >
          Lưu
        </div>
      </div>
      <div className="p-0 select-seat-parent">
        <div className="select-seat-title">GHẾ NGỒI</div>
        <Seats />
        <div className="d-flex justify-content-center mt-2 mb-2">
          <div className="seat-can-select"></div>
          <div className="mr-15">&nbsp; Ghế không tồn tại</div>
          <div className="seat-on-select"></div>
          <div className="mr-15">&nbsp; Ghế tồn tại</div>
        </div>
        <div className="d-flex justify-content-center mb-2">
          <Checkbox onChange={(value) => setSelectAll(value.target.checked)}>
            Chọn tất cả
          </Checkbox>
        </div>
      </div>
    </div>
  );
}
