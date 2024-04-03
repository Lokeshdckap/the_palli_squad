import React, { useState, useEffect } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import TableUserComponent from "./TableUserComponent";
import SecretStoreForm from "./SecretStoreForm";

const TeamDrawer = ({ open, onClose, record,assignRole }) => {
  const [secretForm, setSecretForm] = useState(false);

  const handleOpen = () => {
    setSecretForm(true);
  };

  return (
    <>
      <Drawer
        title={record?.team_name}
        width={700}
        onClose={() => {
          onClose();
        }}
        open={open}
        extra={
          record.role_type !== 3 && (
            <>
              <Space>
                {record.role_type !== 3 && (
                  <>
                    <Button onClick={() => handleOpen()}>Add Secrets</Button>
                  </>
                )}
              </Space>
            </>
          )
        }
      >
           {<SecretStoreForm 
         secretForm={secretForm}
         setSecretForm={setSecretForm}
      />}
        <TableUserComponent
        record={record}
        assignRole={assignRole}
         />
      </Drawer>
   

    </>
  );
};
export default TeamDrawer;
