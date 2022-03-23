import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { getMovies } from "../../services/movie.service";
import "./body.css";
const { TabPane } = Tabs;

export default function ListMoviesComponent() {
  const [tabKey, setTabKey] = useState("1");
  const callback = (key) => {
    setTabKey(key);
  };

  const [listMovies, setListMovies] = useState([]);
  useEffect(() => {
    let query = { limit: 8, page: 1 };
    if (tabKey === "2") {
      query.showStatus = "COMING_SOON";
    } else {
      query.showStatus = "NOW_SHOWING";
    }
    async function fetchData() {
      await getMovies(query)
        .then((rs) => {
          setListMovies(rs.data.items);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [tabKey]);

  const listMovie = () => {
    return (
      <div className="row mt-2">
        {listMovies.map((item, index) => {
          return (
            <a
              href={`/dat-ve/${item.value}`}
              key={index}
              className="col-12 col-md-6 col-lg-3 mb-3"
            >
              <div>
                <img
                  src={item.imageUrl}
                  alt="movie-preview"
                  className="image-movie"
                />
              </div>
              <div className="mt-1">
                <h4 className="m-0 title mb-1">{item.name}</h4>
                <h4 className="m-0 title vn">{item.vietnamName}</h4>
              </div>
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container m-auto list-movies">
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane className="text-disable" tab="Phim đang chiếu" key="1">
          {listMovie()}
        </TabPane>
        <TabPane tab="Phim sắp chiếu" key="2">
          {listMovie()}
        </TabPane>
      </Tabs>
    </div>
  );
}
