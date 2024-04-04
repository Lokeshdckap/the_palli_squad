import React, { useState } from "react";
import { Form, Input, Button, Space, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axiosClient from "../axios-client";
import { toast } from "react-toastify";
export default function Justification({
  reason,
  setReason,
  justification,
  setJustification,
  cookies
}) {
  const onFinish = (values) => {
    let payLoad = {
      email: values.email,
      justification: values.Justification,
      device_id : cookies
    };

    axiosClient
      .post("/api/superAdmin/unAuthorizedDeviceLogin", payLoad)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success(res.data.msg);
          setJustification(false);
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 401) {
          console.error("Error:", response?.status);
        } else {
          console.error("Error:", response?.status);
        }
      });
  };
  const handleModalCancel = ()=>{
     setJustification(false)
  }
  return (
    <div className="flex justify-center items-center">
      <Modal
        title="You are login from an unauthorized device, please enter a valid Justification"
        open={justification}
        width={650}
        onCancel={handleModalCancel}
        footer={null} // Use `footer={null}` instead of `hideFooter={true}`
      >
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="w-full max-w-md p-6 rounded-lg"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Justification"
            name="Justification"
            rules={[
              { required: true, message: "Please input your Justification!" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Enter your Justification" />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                type="text"
                danger
                icon={<CloseOutlined />}
                className="border border-red-500 text-red-500"
                onClick={() => setJustification(false)}
              >
                Close
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
