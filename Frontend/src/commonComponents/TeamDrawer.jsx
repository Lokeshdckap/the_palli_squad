import React, { useState, useEffect } from 'react';
import { Button, Drawer, Radio, Space } from 'antd';
import StoreSecretForm from './storeSecretForm';
import axiosClient from '../axios-client';
import TableUserComponent from './TableUserComponent';

const TeamDrawer = ({ open, onClose, record }) => {
  const [addEdit, setAddEdit] = useState(false);
  const [secretForm, setSecretForm] = useState(false);
  const [addPassword, setAddPassword] = useState(false);


  const handleAccess = (record) => {
    if (record.role_type == 1) {
      setAddEdit(true)
      return;
    }
    if (record.type == 2) {
      setAddPassword(true)
      return;
    }
  }
  const handleCloseDrawer = () => {
    setAddEdit(false);
    setAddPassword(false);
  }

  return (
    <>
      <Drawer
        title={record?.team_name}
        width={700}
        onClose={() => {
          handleCloseDrawer();
          onClose()
        }}
        open={open}
        extra={
          record.role_type !== 3 && (
            <>
            <Space>
              {!addEdit && !addPassword && (<Button type="primary" className='bg-red-500' onClick={handleAccess(record)}>
                Action
              </Button>)}
              {addEdit && (
                <>
                  <Button>Edit</Button>
                  <Button onClick={() => setSecretForm(true)}>Add Password</Button>
                </>
              )}
              {addPassword && (
                <>
                  <Button onClick={() => setSecretForm(true)}>Add Password</Button>
                </>
              )}
            </Space>
            </>
          )
        }

      >
        <TableUserComponent/>

        <p>{record?.team_name}</p>
        <p>{record?.created_at}</p>
        <p>{record?.updated_at}</p>
        {secretForm && (<StoreSecretForm secretForm={secretForm} setSecretForm={setSecretForm} record={record.id} />)}
      </Drawer>
    </>
  );
};
export default TeamDrawer;