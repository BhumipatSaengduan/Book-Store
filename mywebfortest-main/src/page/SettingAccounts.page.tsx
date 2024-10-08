import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from '../components/Main/Header';
import SearchBar from '../components/Main/SearchBar';
import { CartProvider, useCart } from '../components/Main/CartProvider';
import SidebarSetting from '../components/AccountsSetting/SidebarSetting';

import PersonalInfo from '../components/AccountsSetting/PersonalInfo';
import AddressBook from '../components/AccountsSetting/AddressBook';

function SettingsMain() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, setCartItems } = useCart();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const updateQuantity = (id: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity + change, 0) } : item
      )
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <SearchBar />
      <div className="flex">
        <SidebarSetting />
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/address-book" element={<AddressBook />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

const SettingsMainWithProvider = () => (
  <CartProvider>
    <Router>
      <SettingsMain />
    </Router>
  </CartProvider>
);

export default SettingsMainWithProvider;