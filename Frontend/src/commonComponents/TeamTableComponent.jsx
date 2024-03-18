import React from "react";
import { Divider, Table } from "antd";
const columns = [
  {
    title: "S.No",
    dataIndex: "id",
  },
  {
    title: "Team name",
    dataIndex: "team_name",
  },
  {
    title: "Created at",
    dataIndex: "created_at",
  },
  {
    title: "Updated at",
    dataIndex: "updated_at",
  },
  {
    title: "Member count",
    dataIndex: "team_count",
  },
];

const TeamTableComponent = ({ data }) => (
  <>
    {/* {console.log(data)} */}
    <Table
      columns={columns}
      dataSource={data}
      bordered
      size="small"
      // onClick=()
    />
  </>
);
export default TeamTableComponent;
