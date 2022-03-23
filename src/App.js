import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminComponent from "./components/admin/admin.component";
import BuyTicketComponent from "./components/client/buy-ticket.component";
import HistoryComponent from "./components/client/history.component";
import ListMoviesComponent from "./components/client/listmovies.component";
import MovieComponent from "./components/client/movie.component";
import ProfileComponent from "./components/client/profile.component";
import SelectScheduleComponent from "./components/client/select-schedule.component";
import FooterComponent from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import NotFoundComponent from "./components/other/notfound.component";
import Paypal from "./components/payment/paypal.component";
import { getMe } from "./services/auth.service";
import { Role } from "./services/const";

function App() {
  const [me, setMe] = useState(null);
  const [showModalLogin, setShowModalLogin] = useState(false);
  useEffect(() => {
    async function fetchData() {
      await getMe()
        .then((rs) => {
          setMe(rs.data);
        })
        .catch(() => setMe(null));
    }
    fetchData();
  }, []);

  const checkLogin = () => {
    if (!me) {
      setShowModalLogin(true);
    } else {
      setShowModalLogin(false);
    }
  };

  return (
    <div>
      <HeaderComponent
        showModalLogin={showModalLogin}
        setShowModalLogin={setShowModalLogin}
      />
      <BrowserRouter>
        <div className="body-component">
          <Routes>
            <Route path="/" element={<ListMoviesComponent />} />
            <Route path="/lich-chieu" element={<SelectScheduleComponent />} />
            <Route path="/dat-ve/:value" element={<MovieComponent />} />
            <Route
              path="/mua-ve/:value"
              element={
                <BuyTicketComponent
                  callCheckLogin={checkLogin}
                  showModalLogin={showModalLogin}
                />
              }
            />
            <Route path="/thanh-toan" element={<Paypal />} />
            <Route path="/lich-su-mua-ve" element={<HistoryComponent />} />
            <Route path="/trang-ca-nhan" element={<ProfileComponent />} />
            {me?.role === Role.ADMIN && (
              <Route exact path="/admin/*" element={<AdminComponent />} />
            )}
            <Route path="*" element={<NotFoundComponent />} />
          </Routes>
        </div>
      </BrowserRouter>
      <FooterComponent />
    </div>
  );
}

export default App;
