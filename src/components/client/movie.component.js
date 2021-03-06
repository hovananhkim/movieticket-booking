import { Modal, DatePicker, Select, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { getMovieByValue } from "../../services/movie.service";
import { getAllCinemas } from "../../services/cinema.service";
import { getShowTimes } from "../../services/movie_schedule.service";
import { warning } from "../notification/notification";
import "./body.css";

export default function MovieComponent() {
  const params = useParams();
  const navigate = useNavigate();
  const { value } = params;
  const [movie, setMovie] = useState(null);
  const [cinemasSelect, setCinemasSelect] = useState([]);

  const [cinemaId, setCinemaId] = useState(null);
  const [date, setDate] = useState(moment());
  const [showtime, setShowtime] = useState(null);
  const [listTimes, setListTimes] = useState([]);
  const [time, setTime] = useState(null);
  useEffect(() => {
    async function fetchData() {
      await getMovieByValue(value)
        .then((rs) => setMovie(rs.data))
        .catch((err) => console.log(err));
      await getAllCinemas()
        .then((rs) => setCinemasSelect(rs.data))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const query = {
        movieId: movie.id,
        cinemaId,
        date: moment(date).format("YYYY-MM-DD"),
      };
      await getShowTimes(query)
        .then((rs) => {
          const listShows = rs.data;
          if (listShows.length > 0) {
            setListTimes(listShows[0].show);
          } else {
            setListTimes([]);
          }
        })
        .catch((err) => console.log(err));
    }
    if (cinemaId) {
      fetchData();
    }
  }, [cinemaId, date]);

  const { Option } = Select;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeDate = (dateChange) => {
    if (moment(new Date()).isSameOrBefore(dateChange, "date")) {
      setDate(dateChange);
    }
  };

  const handleBuyTicket = (value) => {
    if (!time) {
      warning("Vui l??ng ch???n th???i gian");
    } else navigate(`../mua-ve/${value}?show-id=${time.id}`);
  };

  return (
    movie && (
      <div className="container px-0 py-4">
        <div className="row m-0">
          <div className="col-8 p-0">
            <div className="row m-0">
              <div className="col-4 p-0">
                <img
                  className="cursor-pointer"
                  src={movie.imageUrl}
                  alt="movie-detail"
                  width={300}
                  onClick={showModal}
                />
              </div>
              <div className="col-8 pl-30">
                <div className="row m-0">
                  <h5 className="p-0 mb-3">
                    {movie?.name?.toUpperCase() ||
                      movie?.vietnamName.toUpperCase()}
                  </h5>
                </div>
                <div className="mt-1 d-flex">
                  <label className="text-disable">Th??? lo???i:&nbsp;</label>
                  <div>{movie.type}</div>
                </div>
                <div className="mt-1 d-flex">
                  <label className="text-disable">?????o di???n:&nbsp;</label>
                  <div>{movie.director}</div>
                </div>
                <div className="mt-1 d-flex">
                  <label className="text-disable">Nh?? s???n xu???t:&nbsp;</label>
                  <div>{movie.producer}</div>
                </div>
                <div className="mt-1 d-flex">
                  <label className="text-disable">Qu???c gia:&nbsp;</label>
                  <div>{movie.nation}</div>
                </div>
                <div className="mt-1 d-flex">
                  <label className="text-disable">Di???n vi??n:&nbsp;</label>
                  <div>{movie.casts}</div>
                </div>
                <div className="mt-1 d-flex">
                  <label className="text-disable">Ng??y:&nbsp;</label>
                  <div>{moment(movie.date).format("DD-MM-YYYY")}</div>
                </div>
                <div className="mt-1 d-flex">
                  <label className="text-disable">Th???i gian:&nbsp;</label>
                  <div>{movie.time} ph??t</div>
                </div>
              </div>
            </div>
            <div className="row m-0 mt-5">
              <h5 className="title-content-firm p-0">N???I DUNG PHIM</h5>
              <div className="p-0">
                <p className="mb-1 description-line">{movie.description}</p>
              </div>
            </div>
          </div>
          <div className="col-4 p-0">
            <h5 className="title-content-firm p-0">MUA V??</h5>

            <div class="box-promotion">
              <div className="p-0">
                <div className="row m-0">
                  <div className="p-0 pb-1 title-quick-buy text-disable">
                    Ch???n r???p
                  </div>
                  <Select
                    className={"mb-3"}
                    showSearch
                    placeholder="Ch???n m???t r???p chi???u"
                    optionFilterProp="children"
                    onChange={(id) => setCinemaId(id)}
                  >
                    {cinemasSelect.map((cinema) => {
                      return (
                        <Option key={cinema.value} value={cinema.id}>
                          {cinema.name}
                        </Option>
                      );
                    })}
                  </Select>
                  <div className="p-0 pb-1 title-quick-buy text-disable">
                    Ch???n ng??y
                  </div>
                  <DatePicker
                    className={"mb-3"}
                    onChange={onChangeDate}
                    value={date}
                  />
                  <div className="p-0 pb-1 title-quick-buy text-disable">
                    Ch???n su???t
                  </div>
                  <div className="m-0 mb-3 row time-box">
                    {listTimes &&
                      listTimes.map((time, index) => {
                        return (
                          <div className="col-2 time-item">
                            <div
                              className={`sometime-list text-center ${
                                showtime === index ? "time-selected" : ""
                              }`}
                              onClick={() => {
                                setShowtime(index);
                                setTime(time);
                              }}
                            >
                              {time.time}
                            </div>
                          </div>
                        );
                      })}
                    {!cinemaId && (
                      <div className="mb-2">Vui l??ng ch???n m???t r???p</div>
                    )}
                    {cinemaId && listTimes.length === 0 && (
                      <div className="mb-2">
                        Vui l??ng ch???n r???p ho???c ng??y chi???u kh??c
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                class="register-btn btn primary"
                onClick={() => handleBuyTicket(movie.value)}
              >
                MUA V??
              </div>
            </div>
          </div>
        </div>
        {isModalVisible && (
          <Modal
            title={movie?.name?.toUpperCase() || ""}
            visible={isModalVisible}
            onCancel={handleCancel}
            className={"videoModal"}
          >
            <iframe
              width="560"
              height="315"
              src={movie.trailer}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </Modal>
        )}
      </div>
    )
  );
}
