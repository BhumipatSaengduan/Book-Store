// src/components/Main/Loader.tsx

import React from 'react';

// import รูปภาพที่ต้องการ
import image1 from '../../assets/loading.gif';
import image2 from '../../assets/05fe1b9314f08d4e44e17dceb8ade7a6.gif';
import image3 from '../../assets/7fe38ec56ee274e3005c3cdc91608bae.gif';
import image4 from '../../assets/slp.gif';

const images = [image1, image2, image3, image4]; // รายชื่อรูปภาพ

const Loader: React.FC = () => {
  const randomImage = images[Math.floor(Math.random() * images.length)]; // สุ่มเลือกรูปภาพ

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <img src={randomImage} alt="Loading..." className="animate-bounce" />
    </div>
  );
};

export default Loader;
