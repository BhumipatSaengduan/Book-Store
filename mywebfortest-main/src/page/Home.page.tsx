import React from 'react';
import Header from '../components/Main/Header';
import SearchBar from '../components/Main/SearchBar';
import Banner from '../components/Main/Banner';
import BookSection from '../components/Main/BookSection';
import { useCart } from '../components/Main/CartProvider';

function Home() {
  const { cartItems } = useCart();

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <SearchBar />
      <Banner />
      <BookSection title="หนังสือขายดี" method="best-selling" />
      <BookSection title="หนังสือมาใหม่" method="newest" />
    </div>
  );
}

export default Home;