import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Logout = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token'); // ลบ Token ออกจาก localStorage
    authContext?.setUser(null); // เคลียร์ user ใน context
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;