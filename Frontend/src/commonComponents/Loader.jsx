import React from 'react';
import { Alert, Flex, Spin } from 'antd';

const Loader = () => (
  <div className='w-full h-full bg-red-400 '>
    <Spin tip="Loading..." size="large" className='flex justify-center'>
      {/* <Alert
        message="OTP"
        description="You will receive your One Time Password through e-mai."
        type="info"
      /> */}
    </Spin>
  </div>
);
export default Loader;