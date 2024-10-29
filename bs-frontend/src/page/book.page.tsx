import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../components/Main/CartProvider";
import Header from "../components/Main/Header";
import SearchBar from "../components/Main/SearchBar";
import { type Book } from "../components/hooks/useBook";
import useIsLoggedIn from "../components/hooks/useIsLoggedIn";
import GreenFavorite from "/src/assets/like-10611-green.png";
import WhiteFavorite from "/src/assets/like-10611-white.png";

const Book: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const { cartItems, addToCart, error: cartError } = useCart();
  const { isLoggedIn, token, mustBeLoggedIn, loading: loadLogin } = useIsLoggedIn();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `/api/books/${id}`,
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : {}
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, token]);

  useEffect(() => {
    const item = cartItems.find((item) => item.id === book?.id);
    if (item) setQuantity(item.quantity);
  }, [cartItems, book?.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Book not found</div>;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= book.stocksAvailable) {
      setQuantity(newQuantity);
    }
  };

  const onFavorite = () => {
    if (loadLogin) return;
    mustBeLoggedIn();
    if (!isLoggedIn) return;

    const run = async () => {
      try {
        const response = await fetch(`/api/books/${Number(id)}/${book.favorited ? "un" : ""}favorite`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to favorite/unfavorite book");
        }
        setBook({ ...book, favorited: !book.favorited });
      } catch (err) {
        console.error(err);
      }
    };
    run();
  };

  const addItem = (method: "add" | "buy" = "add") => {
    if (loadLogin) return;
    mustBeLoggedIn();
    if (!isLoggedIn) return;

    const run = async () => {
      try {
        const item = cartItems.find((item) => item.id === book?.id);
        if (!item || item.quantity !== quantity) await addToCart(book.id, quantity);
        if (method === "buy" && !cartError) navigate("/checkout");
      } catch (error) {
        console.error(error);
      }
    };
    run();
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <SearchBar />
      <main className="flex flex-col md:flex-row items-start px-5 md:px-20 max-w-4xl mx-auto my-10 gap-32">
        <div className="w-full md:w-1/3 mb-8 md:mb-0">
          <img src={book.coverImage} alt={`${book.title} book cover`} className="w-full h-auto" />
        </div>
        <div className="md:w-4/5">
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <h2 className="text-xl mb-4">{book.description}</h2>
          <div className="flex items-start">
            <h3 className="text-lg font-semibold mb-4 mr-16">ราคา: ฿ {Number(book.price).toFixed(2)}</h3>
            {book.favorited !== undefined && (
              <button type="button" className="flex gap-2 items-center" onClick={onFavorite}>
                <img
                  src={book.favorited ? WhiteFavorite : GreenFavorite}
                  className={`w-6 ${book.favorited ? "rounded-full bg-[#385723] p-[3px]" : ""}`}
                />
                <span className="text-[#385723] underline">
                  {book.favorited ? "ลบจากรายการโปรด" : "เพิ่มในรายการโปรด"}
                </span>
              </button>
            )}
          </div>
          <div className="flex items-center mb-4">
            <button
              className="bg-white text-green-900 rounded-full p-2 border-2 border-green-900"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              min="1"
              max={book.stocksAvailable}
              className="w-16 text-center mx-3 p-2 border rounded-full"
            />
            <button
              className="bg-white text-green-900 rounded-full p-2 border-2 border-green-900"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </button>
            <p className="ml-4 text-gray-600">มีสินค้าทั้งหมด {book.stocksAvailable} ชิ้น</p>
          </div>
          <div className="flex space-x-4 mb-6">
            <button
              className="bg-green-900 text-white rounded-full px-6 py-2 shadow-md disabled:opacity-50"
              onClick={() => addItem("buy")}
              disabled={book.stocksAvailable < 1}
            >
              ซื้อทันที
            </button>
            <button
              className="bg-white text-green-900 rounded-full px-6 py-2 border-2 border-green-900 shadow-md disabled:opacity-50"
              onClick={() => addItem()}
              disabled={book.stocksAvailable < 1}
            >
              หยิบใส่รถเข็น
            </button>
          </div>
        </div>
      </main>

      <div className="bg-purple-100 rounded-lg px-10 py-8 mx-auto mb-10 w-[80%]">
        <div className="mb-8">
          <h3 className="text-lg font-bold">ข้อมูลหนังสือ</h3>
          <p>รหัสสินค้า : {book.id}</p>
        </div>
        <div>
          <h3 className="font-bold">
            รายละเอียดสินค้า : <span className="font-normal">{book.title}</span>
          </h3>
          <p>{(book as any).fullDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default Book;
