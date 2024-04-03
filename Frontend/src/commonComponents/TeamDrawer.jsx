import React, { useState } from 'react';
import { Button, Drawer, Radio, Space } from 'antd';
const TeamDrawer = ({ placement , open,onClose,record}) => {
//   const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer
        title={record?.team_name}
        placement={placement}
        width={700}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            {/* <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button> */}
          </Space>
        }
      >
        <p>{record?.team_name}</p>
        <p>{record?.created_at}</p>
        <p>{record?.updated_at}</p>
        <div>
          
        </div>
      </Drawer>
    </>
  );
};
export default TeamDrawer;