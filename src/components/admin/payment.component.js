import React, { useEffect, useState } from "react";
import { Table, Pagination, Select } from "antd";
import { itemsPerPage } from "../../services/const";
import { getPayments } from "../../services/payment.service";
import moment from "moment";
import { convertIntToChar } from "../../utils/int-to-char";

export function PaymentsComponent() {
  const [listPayments, setListPayments] = useState([]);
  const [meta, setMeta] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const { Option } = Select;

  useEffect(() => {
    async function fetchData() {
      const query = { limit, page, phone, orderId, email };
      getPayments(query)
        .then((rs) => {
          setListPayments(rs.data.items);
          setMeta(rs.data.meta);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [limit, page, phone, orderId, email]);

  const columns = [
    {
      title: "Tên",
      dataIndex: ["user", "name"],
      key: "username",
    },
    {
      title: "Số ĐT",
      dataIndex: ["user", "phone"],
      key: "phone",
    },
    {
      title: "Ghế",
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
      title: "Phim",
      dataIndex: ["movieSchedule", "movie", "name"],
      key: "movie",
    },
    {
      title: "Ngày",
      dataIndex: ["movieSchedule", "date"],
      key: "date",
    },
    {
      title: "Thời gian",
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
      title: "Code",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Số tiền",
      dataIndex: "price",
      key: "price",
    },
  ];

  const data = listPayments;

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <div className=" d-flex">
          <div>
            <input
              type={"text"}
              placeholder="Code"
              onChange={(e) => setOrderId(e.target.value)}
              className="ant-input input-box-custom"
            />
          </div>
          <div className="ml-10px">
            <input
              type={"text"}
              placeholder="phone"
              onChange={(e) => setPhone(e.target.value)}
              className="ant-input input-box-custom"
            />
          </div>
          <div className="ml-10px">
            <input
              type={"text"}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="ant-input input-box-custom"
            />
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
            showTotal={(total) => `Tổng số ${total} đã thanh toán`}
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
