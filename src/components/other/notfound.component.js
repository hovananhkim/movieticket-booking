import "./notfound.css";

export default function NotFoundComponent() {
  return (
    <div className="not-found">
      <div className="not-found-title">Không tìm thấy trang</div>
      <div className="sorry">Xin lỗi chúng tôi không tìm thấy trang này</div>
      <a href="/" className="link">
        Trở về trang chủ
      </a>
      <div className="line-parent">
        <div className="line" />
      </div>
    </div>
  );
}
