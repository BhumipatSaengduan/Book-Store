import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartProvider";
import DOMPurify from "dompurify";
import useLoggedIn from "../hooks/useIsLoggedIn";

interface CartProps {
  isOpen: boolean;
  toggleCart: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, toggleCart }) => {
  const { loading: loadLogin, isLoggedIn } = useLoggedIn();

  const { cartItems, updateCartItem, loading: loadCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = (id: number, change: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) updateCartItem(id, item.quantity + change);
  };

  const handleCheckout = () => {
    navigate("/checkout");
    toggleCart();
  };

  const loading = [loadLogin, loadCart].some((x) => x);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleCart} />}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-gray-100 shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="bg-white p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">สินค้าในตะกร้า ({cartItems.length} รายการ)</h2>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading && <p className="p-4">กำลังโหลด...</p>}
          {!isLoggedIn ? (
            <p className="p-4">กรุณาเข้าสู่ระบบ</p>
          ) : cartItems.length === 0 ? (
            <p className="p-4">ไม่มีสินค้าในตะกร้า</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-white mb-2 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={
                      DOMPurify.sanitize(item.coverImage) ||
                      "../../assets/HD-wallpaper-loadnig-cat-meme-loading-cat-meme-cat-thumbnail"
                    }
                    alt={DOMPurify.sanitize(item.title)}
                    className="w-16 h-16 object-cover mr-4"
                    onError={(e) => (e.currentTarget.src = "path/to/placeholder-image.jpg")}
                  />
                  <div>
                    <h3 className="font-semibold">{DOMPurify.sanitize(item.title)}</h3>
                    <p className="text-gray-600">฿{DOMPurify.sanitize(item.price)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className={`w-8 h-8 text-white rounded-full disabled:opacity-60 ${
                      item.quantity === 1 ? "bg-red-600" : "bg-green-600"
                    }`}
                    disabled={loading || item.quantity < 0}
                  >
                    -
                  </button>
                  <span className="mx-2">{DOMPurify.sanitize(item.quantity.toString())}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="w-8 h-8 bg-green-600 text-white rounded-full disabled:opacity-60"
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">ราคารวม:</span>
            <span className="font-semibold">฿{totalPrice.toFixed(2)}</span>
          </div>
          <button
            className={`w-full py-2 text-white rounded bg-green-600 disabled:bg-gray-600 disabled:opacity-50`}
            onClick={handleCheckout}
            disabled={loading || cartItems.length === 0 || !isLoggedIn}
          >
            สั่งสินค้า
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
