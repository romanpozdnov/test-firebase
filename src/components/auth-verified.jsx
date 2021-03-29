import React from 'react';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';

import { authVerifyingStatusSelector } from '../redux/slices/userSlice';

export const AuthVerified = ({ children }) => {
  const authVerifyingStatus = useSelector(authVerifyingStatusSelector);

  return authVerifyingStatus === 'pending' ? (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spin size="large" />
    </div>
  ) : (
    children
  );
};
