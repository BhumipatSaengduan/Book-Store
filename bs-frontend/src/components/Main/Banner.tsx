import React from 'react';
import adImage from '/src/assets/ad1.jpg';

const Banner: React.FC = () => {
  return (
    <div className="bg-white p-5 flex justify-center items-center">
      <a href="#">
        <img src={adImage} alt="Advertisement" className="max-w-full h-auto" />
      </a>
    </div>
  );
};

export default Banner;
