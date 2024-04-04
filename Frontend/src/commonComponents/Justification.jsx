import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export default function Justification({ reason, setReason }) {
    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    return (
        <div className="flex justify-center items-center">
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                className="w-full max-w-md border border-gray-300 p-6 rounded-lg h-[250px]"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input your description!' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter your description" />
                </Form.Item>

                <Form.Item className="flex justify-end">
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button type="text" danger icon={<CloseOutlined />} className='border border-red-500 text-red-500' onClick={() => setReason(false)}>
                            Close
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};
