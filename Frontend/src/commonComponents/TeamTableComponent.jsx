import React from "react";
import { Divider, Table } from "antd";
const columns = [
  {
    title: "S.No",
    dataIndex: "team_id",
  },
  {
    title: "Team name",
    dataIndex: "team_name",
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
      onRow={(record, rowIndex) => {
        return {
        onClick: event => {
        console.log(record)
        }}
      }}
    />
  </>
);
export default TeamTableComponent;
