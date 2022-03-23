import React, { useEffect, useState } from "react";
import { Table, Pagination, Select } from "antd";
import { getUsers } from "../../services/users.service";
import { itemsPerPage } from "../../services/const";

export function UsersComponent() {
  const [listUsers, setListUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  useEffect(() => {
    async function fetchData() {
      await getUsers().then((rs) => {
        setListUsers(rs.data.items);
        setMeta(rs.data.meta);
      });
    }
    fetchData();
  }, [limit, page]);
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
  ];

  const data = listUsers;
  const { Option } = Select;
  return (
    <div>
      <div className=" d-flex justify-content-between mb-4">
        <div className="w-25">
          <div className="d-flex">
            <input
              type={"text"}
              placeholder="Tìm kiếm"
              className="ant-input input-box-custom"
            />
            <div className="button-search-custom text-center cursor-pointer">
              Tìm
            </div>
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
            showTotal={(total) => `Tổng số ${total} khách hàng`}
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
