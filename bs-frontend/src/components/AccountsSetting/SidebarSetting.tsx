import React, { useState } from "react";
import { Link } from "react-router-dom";

const SidebarSetting: React.FC = () => {
  const [isAccountSubMenuVisible, setAccountSubMenuVisible] = useState(false);
  const [isNotificationSubMenuVisible, setNotificationSubMenuVisible] = useState(false);

  const toggleSubMenu = (menuType: string) => {
    if (menuType === 'account') {
      setAccountSubMenuVisible(!isAccountSubMenuVisible);
    } else if (menuType === 'notification') {
      setNotificationSubMenuVisible(!isNotificationSubMenuVisible);
    }
  };

  return (
    <div className="font-sans m-0 p-0 min-h-screen flex justify-center items-start">
      <aside className="w-[200px] p-5 m-4 bg-white rounded-[20px] h-[550px] shadow-lg">
        <div className="flex items-center mb-5">
          <img src="/api/placeholder/50/50" alt="User Avatar" className="w-[50px] h-[50px] rounded-full mr-3" />
          <div>
            <strong>goodboy</strong>
            <div className="text-sm text-gray-500">แก้ไขข้อมูลส่วนตัว</div>
          </div>
        </div>
        <div className="mb-4 text-gray-700 cursor-pointer" onClick={() => toggleSubMenu('account')}>
          จัดการบัญชีของฉัน
        </div>
        {isAccountSubMenuVisible && (
          <div className="ml-5">
            <Link to="/personal-info" className="block mb-3 text-gray-700 cursor-pointer">ข้อมูลส่วนตัว</Link>
            <Link to="/address-book" className="block mb-3 text-gray-700 cursor-pointer">สมุดที่อยู่</Link>
          </div>
        )}
        <div className="mb-4 text-gray-700 cursor-pointer" onClick={() => toggleSubMenu('notification')}>
          การแจ้งเตือน
        </div>
        {isNotificationSubMenuVisible && (
          <div className="ml-5">
            <Link to="/purchase-history" className="block mb-3 text-gray-700 cursor-pointer">รายการที่เคยซื้อ</Link>
            <div className="mb-3 text-gray-700 cursor-pointer">การเปลี่ยนสินค้า</div>
            <div className="mb-3 text-gray-700 cursor-pointer">การคืนสินค้า</div>
            <div className="mb-3 text-gray-700 cursor-pointer">การยกเลิกสินค้า</div>
          </div>
        )}
        <Link to="/favorites" className="block mb-4 text-gray-700 cursor-pointer">รายการที่ชอบ</Link>
      </aside>
    </div>
  );
};

export default SidebarSetting;