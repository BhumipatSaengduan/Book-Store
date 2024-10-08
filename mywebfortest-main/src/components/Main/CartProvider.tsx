import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string; // เพิ่มโปรเปอร์ตี้ image
}

interface CartContextType {
  cartItems: CartItem[];
  updateCartItem: (bookId: number, amount: number) => Promise<void>;
  checkout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  addToCart: (item: CartItem) => void;
  fetchCartItems: () => Promise<void>;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/cart');
      setCartItems(
        response.data.items.map((item: any) => ({
          id: item.id,
          name: item.title,
          price: item.price,
          quantity: item.amount,
          image: item.image // ตรวจสอบให้แน่ใจว่าคุณได้ดึงข้อมูลภาพจาก API
        }))
      );
    } catch (err) {
      setError('Failed to fetch cart items');
      toast.error('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateCartItem = async (bookId: number, amount: number) => {
    if (amount === 0) return; // ไม่ทำอะไรหากจำนวนเป็น 0
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // ดึง Token จาก storage
      await axios.post('/api/cart', { bookId, amount }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchCartItems(); // อัปเดตสินค้าหลังจากเพิ่มหรืออัปเดต
      toast.success('Cart updated successfully');
    } catch (err) {
      setError('Failed to update cart item');
      toast.error('Failed to update cart item');
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // ดึง Token จาก storage
      await axios.get('/api/cart/checkout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems([]); 
      toast.success('Checkout successful');
    } catch (err) {
      setError('Failed to checkout');
      toast.error('Failed to checkout');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      updateCartItem, 
      checkout, 
      loading, 
      error, 
      addToCart, 
      fetchCartItems,
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
