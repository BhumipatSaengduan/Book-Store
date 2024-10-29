import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import useLoggedIn from "../hooks/useIsLoggedIn";

export interface CartItem {
  id: number;
  title: string;
  price: string;
  quantity: number;
  coverImage: string;
}

interface CartContextType {
  cartItems: CartItem[];
  updateCartItem: (bookId: number, amount: number) => Promise<void>;
  checkout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  addToCart: (bookId: number, amount: number) => Promise<void>;
  fetchCartItems: () => Promise<void>;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading: loadLogin, isLoggedIn, token } = useLoggedIn();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setCartItems(
        data.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.amount,
          coverImage: item.coverImage,
        }))
      );
    } catch (err) {
      setError("Failed to fetch cart items");
      toast.error("เกิดข้อผิดพลากขณะดึงข้อมูลตะกร้า");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadLogin || isLoggedIn === false) return;
    fetchCartItems();
  }, [isLoggedIn]);

  const addToCart = async (bookId: number, amount: number) => {
    if (amount < 0) return;

    setLoading(true);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId, amount }),
      });

      const item = cartItems.find((item) => item.id === bookId);
      await fetchCartItems();

      if (amount === 0) toast.success("ลบสินค้าในตะกร้าแล้ว", { position: "top-left" });
      else if ((item?.quantity ?? 0) < amount) {
        toast.success("เพิ่มสินค้าในตะกร้าแล้ว", { position: "top-left" });
      } else toast.success("ลดจำนวนสินค้าในตะกร้าแล้ว", { position: "top-left" });
    } catch (err) {
      setError("Failed to add/update cart item");
      toast.error("เกิดข้อผิดพลาดขณะเพิ่ม/แก้ไขสินค้าในตะกร้า");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = addToCart;

  const checkout = async () => {
    setLoading(true);
    try {
      await fetch("/api/cart/checkout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setCartItems([]);
      toast.success("สั่งซื้อเสร็จสิ้น");
    } catch (err) {
      setError("Failed to checkout");
      toast.error("เกิดข้อผิดพลาดขณะสั่งซื้อ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        updateCartItem,
        checkout,
        loading,
        error,
        addToCart,
        fetchCartItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
