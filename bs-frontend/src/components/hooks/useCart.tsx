// import { useState, useEffect } from 'react';

// export const useCart = () => {
//   const [cartItems, setCartItems] = useState([]);

//   // Load cart from localStorage on initial render
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       setCartItems(JSON.parse(savedCart));
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (book: { id: any; }, quantity: any) => {
//     setCartItems(prevItems => {
//       const existingItem = prevItems.find(item => item.id === book.id);
//       if (existingItem) {
//         return prevItems.map(item =>
//           item.id === book.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }
//       return [...prevItems, { ...book, quantity }];
//     });
//   };

//   const removeFromCart = (bookId: any) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
//   };

//   const updateQuantity = (bookId: any, newQuantity: number) => {
//     if (newQuantity < 1) {
//       removeFromCart(bookId);
//     } else {
//       setCartItems(prevItems =>
//         prevItems.map(item =>
//           item.id === bookId ? { ...item, quantity: newQuantity } : item
//         )
//       );
//     }
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   return {
//     cartItems,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getTotalItems,
//     getTotalPrice,
//   };
// };
