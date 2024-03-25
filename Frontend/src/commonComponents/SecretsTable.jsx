import React from "react";
import { Divider, Table } from "antd";
const columns = [
    {
        title: "S.No",
        dataIndex: "id",
    },
    {
        title: "Title",
        dataIndex: "title",
    },
    {
        title: "UserName",
        dataIndex: "user_name",
    },
    {
        title: "Description",
        dataIndex: "description",
    },
    {
        title: "Secrets",
        dataIndex: "secret_column",
    },

];

const SecretsTableComponent = ({ data }) => (
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

export default SecretsTableComponent;
