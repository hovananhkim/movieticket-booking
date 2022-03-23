import { Table, Pagination, Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getMe } from "../../services/auth.service";
import { itemsPerPage } from "../../services/const";
import { getPaymentsByUser } from "../../services/payment.service";
import { convertIntToChar } from "../../utils/int-to-char";
import "./body.css";

export default function HistoryComponent() {
  const [me, setMe] = useState(null);
  const [listPayments, setListPayments] = useState([]);
  const [meta, setMeta] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const { Option } = Select;
  useEffect(() => {
    async function fetchData() {
      await getMe().then((rs) => setMe(rs.data));
      const query = { limit, page };
      await getPaymentsByUser(query).then((rs) => {
        setListPayments(rs.data.items);
        setMeta(rs.data.meta);
      });
    }
    fetchData();
  }, [limit, page]);

  const columns = [
    {
      title: "Tên phim",
      dataIndex: ["movieSchedule", "movie", "name"],
      key: "movie",
    },
    {
      title: "Code",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Rạp chiếu",
      dataIndex: ["movieSchedule", "room", "cinema", "name"],
      key: "cinema",
    },
    {
      title: "Phòng chiếu",
      dataIndex: ["movieSchedule", "room", "name"],
      key: "room",
    },
    {
      title: "Ghế ngồi",
      dataIndex: "seatsStatus",
      key: "seats",
      render: (seats) => (
        <div className="d-flex">
          {seats.map((s) => {
            return (
              <div>
                {convertIntToChar(s.row)}
                {s.col}&nbsp;
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: "Ngày chiếu",
      dataIndex: ["movieSchedule", "date"],
      key: "date",
    },
    {
      title: "Suất chiếu",
      dataIndex: ["movieSchedule", "time"],
      key: "time",
    },
    {
      title: "Thanh toán",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <div>{moment(date).format("hh:mm DD-MM-YYYY")}</div>,
    },
    {
      title: "Tổng cộng",
      dataIndex: "price",
      key: "price",
    },
  ];
  const data = listPayments;
  return me ? (
    <div className="container">
      {listPayments && (
        <div className="mt-3">
          <h5 className="title mb-3">Lịch sử mua vé</h5>
          <Table columns={columns} dataSource={data} pagination={false} />
          <div>
            <div className="d-flex justify-content-end mt-2">
              <Pagination
                total={meta?.totalItems}
                defaultCurrent={page}
                defaultPageSize={limit}
                pageSize={limit}
                showTotal={(total) => `Tổng số ${total} thanh toán`}
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
      )}
      {!listPayments && (
        <div className="mt-3">
          <div className="history-none">Bạn chưa từng mua vé</div>
        </div>
      )}
    </div>
  ) : (
    <div className="history-none">
      Vui lòng đăng nhập để xem thông tin chi tiết
    </div>
  );
}
