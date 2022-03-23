import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SeatModel } from "../../models/seat.model";
import { getMe } from "../../services/auth.service";
import { getMovieSchedule } from "../../services/movie_schedule.service";
import { setTicket } from "../../services/payment.service";
import { convertIntToChar } from "../../utils/int-to-char";
import { warning } from "../notification/notification";
import Paypal from "../payment/paypal.component";
import "./body.css";

export default function BuyTicketComponent(props) {
  const { callCheckLogin, showModalLogin } = props;
  const [me, setMe] = useState(null);
  const [seatsSelected, setSeatsSelected] = useState([]);
  const [searchParams] = useSearchParams();
  const [movieSchedule, setMovieSchedule] = useState(null);
  const [seatsStatus, setSeatsStatus] = useState([]);
  const [room, setRoom] = useState([]);
  const [movie, setMovie] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await getMe()
        .then((rs) => {
          setMe(rs.data);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [showModalLogin]);

  useEffect(() => {
    const showId = searchParams.get("show-id");
    async function fetchData() {
      await getMovieSchedule(showId)
        .then((rs) => {
          setMovieSchedule(rs.data);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [searchParams, isModalVisible]);

  useEffect(() => {
    if (movieSchedule) {
      setSeatsStatus(movieSchedule.seatsStatus);
      setRoom(movieSchedule.room);
      setMovie(movieSchedule.movie);
    }
  }, [movieSchedule, isModalVisible]);

  const handleCancel = () => {
    setIsModalVisible(false);
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
    const obj = seatsStatus.find(
      (val) => val.col === x && val.row === y && val.isAdded
    );
    return {
      success: obj ? true : false,
      data: obj || {},
    };
  };

  const checkOnSelect = (x, y) => {
    return seatsSelected.find((seat) => seat.col === x && seat.row === y);
  };
  const rows = new Array(room.lengthRow).fill(1);
  const cols = new Array(room.lengthCol).fill(2);
  const Seats = () => {
    return (
      <div className="w-100">
        {rows.map((valRow, row) => {
          return (
            <div className="row m-0 px-12 justify-content-center">
              <div className="col p-0 text-center seat-row d-flex justify-content-center flex-column">
                {convertIntToChar(row)}
              </div>
              {cols.map((valCol, col) => {
                const { data, success } = checkPosition(col + 1, row + 1);
                return success ? (
                  <div
                    className={`p-0 text-center seat d-flex justify-content-center flex-column  ${
                      checkOnSelect(col + 1, row + 1) ? "highlight" : ""
                    }
                ${data.isReserved ? "disable-seat" : "cursor-pointer"}`}
                    onClick={() => {
                      if (data.isReserved === false) {
                        setPost(col + 1, row + 1);
                      }
                    }}
                  >
                    {col + 1}
                  </div>
                ) : (
                  <div className="col p-0 text-center seat-none d-flex justify-content-center flex-column" />
                );
              })}
              <div className="col p-0 text-center seat-row d-flex justify-content-center flex-column">
                {convertIntToChar(row)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handlePayment = () => {
    if (!me) {
      callCheckLogin();
    } else {
      if (seatsSelected.length === 0) {
        warning("Vui lòng chọn ghế");
      } else {
        const ticket = {
          seatsStatus: seatsSelected,
          scheduleId: movieSchedule.id,
          price: movieSchedule.price,
          movie: movie,
        };
        setTicket(JSON.stringify(ticket));
        setIsModalVisible(true);
      }
    }
  };
  const handlePaymentOK = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container select-seat">
      <div className="row">
        <div className="col-9 p-0 select-seat-parent">
          <div className="select-seat-title">CHỌN GHẾ</div>
          <div>
            <div className="text-center">
              <div>Màn hình</div>
              <div className="screen"></div>
            </div>
            <Seats />

            <div className="d-flex justify-content-center mt-5 mb-5">
              <div className="seat-can-select"></div>
              <div className="mr-15">&nbsp; Ghế được chọn</div>
              <div className="seat-disable"></div>
              <div className="mr-15">&nbsp; Ghế không được chọn</div>
              <div className="seat-on-select"></div>
              <div className="mr-15">&nbsp; Ghế đang chọn</div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="ticket-preview">
            <div className="p-3">
              <h5>{movie?.name?.toUpperCase()}</h5>
              <img
                className="ticket-preview-img"
                alt="movie"
                src={movie?.imageUrl}
              />
              <div className="mt-2 mb-3">
                <div className="d-flex">
                  <div className="label-buy-ticket">Rạp:&nbsp;</div>
                  <div>{room?.cinema?.name}</div>
                </div>
                <div className="d-flex">
                  <div className="label-buy-ticket">Phòng:&nbsp;</div>
                  <div>{room?.name}</div>
                </div>
                <div className="d-flex">
                  <div className="label-buy-ticket">Ngày:&nbsp;</div>
                  <div>{movieSchedule?.date}</div>
                </div>
                <div className="d-flex">
                  <div className="label-buy-ticket">Suất chiếu:&nbsp;</div>
                  <div>{movieSchedule?.time}</div>
                </div>
                <div className="d-flex">
                  <div className="label-buy-ticket">Ghế:&nbsp;</div>
                  {seatsSelected.map((s) => {
                    return (
                      <div>{convertIntToChar(s.row - 1) + s.col} &nbsp;</div>
                    );
                  })}
                </div>
                <div className="d-flex">
                  <div className="label-buy-ticket">Tổng cộng:&nbsp;</div>
                  <div>{seatsSelected.length * movieSchedule?.price} VND</div>
                </div>
              </div>
              <div className="row m-0">
                <div className="col-6 pl-0">
                  <div className="button text-center cursor-pointer w-full">
                    Quay lại
                  </div>
                </div>
                <div className="col-6 pr-0">
                  <div
                    className="button text-center cursor-pointer w-full"
                    onClick={() => handlePayment()}
                  >
                    Mua vé
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <Paypal handlePaymentOK={handlePaymentOK} />
      </Modal>
    </div>
  );
}
