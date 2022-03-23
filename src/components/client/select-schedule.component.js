import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, Tabs } from "antd";
import { Col, Row } from "react-bootstrap";
import { getMoviesNowShowing } from "../../services/movie.service";
import { getCinemasNowShowing } from "../../services/cinema.service";
import { getShowTimes } from "../../services/movie_schedule.service";
import "./body.css";
const { TabPane } = Tabs;

export default function SelectScheduleComponent(props) {
  const [isMovie, setIsMovie] = useState(true);
  const [movieSelected, setMovie] = useState(null);
  const [cinemaSelected, setCinema] = useState(null);
  const [listMovies, setListMovies] = useState([]);
  const [listCinemas, setListCinemas] = useState([]);
  const [moviesSelect, setMoviesSelect] = useState([]);
  const [cinemasSelect, setCinemasSelect] = useState([]);
  const [listTimes, setListTimes] = useState([]);
  const navigate = useNavigate();

  const callback = (key) => {
    if (key === "2") {
      setIsMovie(false);
    } else {
      setIsMovie(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await getMoviesNowShowing()
        .then((rs) => {
          setListMovies(rs.data);
          setMoviesSelect(rs.data);
        })
        .catch((err) => console.log(err));
      await getCinemasNowShowing()
        .then((rs) => setListCinemas(rs.data))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, []);

  useEffect(() => {
    setCinema(null);
    setMovie(null);
    setListTimes([]);
    if (isMovie) {
      setCinemasSelect([]);
      setMoviesSelect(listMovies);
    } else {
      setCinemasSelect(listCinemas);
      setMoviesSelect([]);
    }
  }, [isMovie]);

  useEffect(() => {
    async function fetchData() {
      const query = { cinemaId: cinemaSelected.id };
      await getMoviesNowShowing(query)
        .then((rs) => setMoviesSelect(rs.data))
        .catch((err) => console.log(err));
    }
    if (cinemaSelected?.id && !isMovie) {
      setMovie(null);
      fetchData();
    }
    async function fetchData2() {
      const query = { cinemaId: cinemaSelected.id, movieId: movieSelected.id };
      await getShowTimes(query)
        .then((rs) => setListTimes(rs.data))
        .catch((err) => console.log(err));
    }
    if (cinemaSelected?.id && movieSelected?.id) {
      fetchData2();
    } else {
      setListTimes([]);
    }
  }, [cinemaSelected]);

  useEffect(() => {
    async function fetchData() {
      const query = { movieId: movieSelected.id };
      await getCinemasNowShowing(query)
        .then((rs) => setCinemasSelect(rs.data))
        .catch((err) => console.log(err));
    }
    if (movieSelected?.id && isMovie) {
      setCinema(null);
      fetchData();
    }
    async function fetchData2() {
      const query = { cinemaId: cinemaSelected.id, movieId: movieSelected.id };
      await getShowTimes(query)
        .then((rs) => setListTimes(rs.data))
        .catch((err) => console.log(err));
    }
    if (cinemaSelected?.id && movieSelected?.id) {
      fetchData2();
    }
  }, [movieSelected]);

  const ListMovies = () => {
    return (
      <List
        header={<div>CHỌN PHIM</div>}
        bordered
        dataSource={moviesSelect}
        renderItem={(item) => (
          <List.Item
            className={`cursor-pointer ${
              item.id === movieSelected?.id ? "selected" : ""
            }`}
            onClick={() => setMovie(item)}
          >
            {item.name}
          </List.Item>
        )}
      />
    );
  };
  const ListCinemas = () => {
    return (
      <List
        header={<div>CHỌN RẠP</div>}
        bordered
        dataSource={cinemasSelect}
        renderItem={(item) => (
          <List.Item
            className={`cursor-pointer ${
              item.value === cinemaSelected?.value ? "selected" : ""
            }`}
            onClick={() => setCinema(item)}
          >
            {item.name}
          </List.Item>
        )}
      />
    );
  };

  const handleBuyTicket = (movie, id) => {
    navigate(`../mua-ve/${movie.value}?show-id=${id}`);
  };

  const list = () => {
    return (
      <div>
        <Row>
          {isMovie && (
            <Col>
              <ListMovies />
            </Col>
          )}
          <Col>
            <ListCinemas />
          </Col>
          {!isMovie && (
            <Col>
              <ListMovies />
            </Col>
          )}
          <Col>
            <List
              header={<div>CHỌN SUẤT</div>}
              bordered
              dataSource={listTimes}
              renderItem={(item) => (
                <List.Item>
                  <div className="row w-100">
                    <div className="p-1 pb-4">{item.date}</div>
                    {item.show.map((val) => {
                      return (
                        <div className="col-2 time-item p-1">
                          <div
                            className="sometime-list text-center"
                            onClick={() =>
                              handleBuyTicket(movieSelected, val.id)
                            }
                          >
                            {val.time}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className="container m-auto list-movies">
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Theo phim" key="1">
          {list()}
        </TabPane>
        <TabPane tab="Theo rạp" key="2">
          {list()}
        </TabPane>
      </Tabs>
    </div>
  );
}
