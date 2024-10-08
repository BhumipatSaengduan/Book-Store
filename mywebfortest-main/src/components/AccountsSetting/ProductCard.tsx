import React from "react";

const ProductCard: React.FC = () => {
  return (
    <div className="flex border border-gray-300 p-5 mb-5">
      <img 
        src="/api/placeholder/100/150" 
        alt="Alya Book Cover" 
        className="w-24 h-36 object-cover mr-5" 
      />
      <div className="flex-grow">
        <h3 className="text-lg font-bold">Alya sometimes hides her feelings in russian 1</h3>
        <p className="text-gray-700">ผู้แต่ง : ชันชันชิน</p>
        <p className="text-gray-700">ราคา : ฿ 650.00</p>
      </div>
      <button className="bg-purple-200 text-gray-800 border-none py-2 px-4 rounded cursor-pointer">
        หยิบใส่รถเข็น
      </button>
    </div>
  );
};

export default ProductCard;
