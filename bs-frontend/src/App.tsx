// import { lazy, Suspense, useEffect } from 'react';
// import { Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import BookDetail from "./page/book.page";
import Loader from "./components/Main/Loader";
import NotFound from "./components/Main/NotFound";
import { CartProvider } from "./components/Main/CartProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Home = lazy(() => import("./page/Home.page"));
const Login = lazy(() => import("./page/Login.page"));
const AllItemBook = lazy(() => import("./page/AllItemBook.page"));
// const SettingAccounts = lazy(() => import("./page/SettingAccounts.page"));
const BestSellerBook = lazy(() => import("./page/BestSellerBook.page"));
const NewBook = lazy(() => import("./page/NewBook.page"));
const Payment = lazy(() => import("./page/payment.page"));
const Checkout = lazy(() => import("./page/CheckoutPage.page"));
const Wishlist = lazy(() => import("./page/wishlist.page"));
const Admin = lazy(() => import("./page/Admin.page"));
const AdminBooks = lazy(() => import("./page/AdminBooks.page"));
const AdminBooksDetail = lazy(() => import("./page/AdminBooksDetail.page"));
const AdminCategories = lazy(() => import("./page/AdminCategories.page"));
const AdminCategoriesDetail = lazy(() => import("./page/AdminCategoriesDetail.page"));

const App: React.FC = () => {
  // const location = useLocation();

  // useEffect(() => {
  //   // การจัดการที่ไม่ต้องการให้เกิด refresh
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     e.preventDefault();
  //     e.returnValue = ''; // ป้องกันการ reload หน้า
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [location.pathname]);

  return (
    <CartProvider>
      <div style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0 }}>
        <ToastContainer />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/AllItemBook" element={<AllItemBook />} />
            {/* <Route path="/SettingAccounts" element={<SettingAccounts />} /> */}
            <Route path="/BestSellerBook" element={<BestSellerBook />} />
            <Route path="/NewBook" element={<NewBook />} />
            <Route path="/Loader" element={<Loader />} />
            <Route path="/checkout" element={<Payment />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/Payment" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/books/:id" element={<AdminBooksDetail />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/categories/:id" element={<AdminCategoriesDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </CartProvider>
  );
};

export default App;
