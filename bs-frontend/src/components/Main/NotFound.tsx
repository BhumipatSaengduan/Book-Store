// src/components/NotFound.tsx

import React from 'react';
import notFoundImage from '../../assets/ppwdqm8hhp5uOsdj22Os-o.jpg'; // เปลี่ยนเส้นทางตามที่คุณเก็บรูปภาพ

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={notFoundImage} alt="Not Found" className="w-1/2 md:w-1/3 lg:w-1/4" />
      <h1 className="text-2xl font-bold mt-4">404 - หาไม่เจออะ</h1>
      <p className="text-gray-600 mt-2">ไป้ มันบัคเว้ย!</p>
    </div>
  );
};

export default NotFound;
