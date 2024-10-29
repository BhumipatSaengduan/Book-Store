// src/page/CheckoutPage.tsx

import React, { useEffect, useState } from 'react';
import slipImage from '../assets/qrcode.jpg'; // เปลี่ยนเส้นทางตามที่คุณเก็บรูปภาพ
import { useCart } from '../components/Main/CartProvider';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [slip, setSlip] = useState<File | null>(null);
  const { checkout, cartItems } = useCart()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSlip(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // ทำการส่งสลิปไปยังเซิร์ฟเวอร์ที่นี่
    console.log('Uploaded slip:', slip);
    checkout()
  };

  useEffect(() => {
    if (cartItems.length === 0) navigate("/")
  }, [cartItems])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">ชำระเงิน</h1>
      <img src={slipImage} alt="Slip" className="w-1/2 md:w-1/3 lg:w-1/4 mb-4" />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <label className="block mb-2 text-gray-700">เลือกไฟล์สลิปการจ่ายเงิน:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded p-2 w-full mb-4"
          // required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
        >
          ส่ง
        </button>
      </form>
    </div>
  );
};

export default Checkout;
