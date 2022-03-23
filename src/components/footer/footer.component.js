import "./footer.css";
export default function FooterComponent() {
  return (
    <div className="footer-box">
      <div className="row h-100">
        <div className="col-3 footer-item">
          <div className="title color-o mb-2 title-footer">
            Thông tin cá nhân
          </div>
          <div className="color-o">GVHD: Nguyễn Thế Xuân Ly</div>
          <div className="color-o">SVTH: Hồ Văn Anh Kim</div>
          <div className="color-o">MSSV: 10217003</div>
          <div className="color-o">Lớp: 17T1</div>
        </div>
        <div className="col-3 footer-item">
          <div>
            <div className="title color-o mb-2 title-footer">Giới thiệu</div>
            <div className="color-o">ĐỒ ÁN TỐT NGHIỆP</div>
            <div className="color-o">KHOA CÔNG NGHỆ THÔNG TIN</div>
            <div className="color-o">TRƯỜNG ĐẠI HỌC BÁCH KHOA ĐÀ NẴNG</div>
            <div className="color-o">ĐỀ TÀI: WEBSITE BÁN VÉ XEM PHIM</div>
          </div>
        </div>
        <div className="col-3 footer-item">
          <div className="title color-o mb-2 title-footer">
            Công nghệ sử dụng
          </div>
          <div className="color-o">
            <a href="https://www.nestjs.com/" className="color-o">
              Lập trình Nestjs
            </a>
          </div>
          <div className="color-o">
            <a href="https://www.reactjs.org/" className="color-o">
              Lập trình Reactjs
            </a>
          </div>
          <div className="color-o">
            <a href="https://developer.paypal.com/" className="color-o">
              Paypal Api
            </a>
          </div>
        </div>
        <div className="col-3 footer-item">
          <div className="title color-o mb-2 title-footer">Tham khảo</div>
          <div className="color-o">
            <a href="https://www.galaxycine.vn/" className="color-o">
              Galaxy Cinema
            </a>
          </div>
          <div className="color-o">
            <a href="https://cinestar.com.vn/" className="color-o">
              Cinestar
            </a>
          </div>
          <div>
            <a href=""></a>
          </div>
        </div>
      </div>
    </div>
  );
}
