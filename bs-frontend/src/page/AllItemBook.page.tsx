import axios from "axios";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../components/Main/CartProvider";
import Header from "../components/Main/Header";
import Pagination from "../components/Main/Pagination";
import SearchBar from "../components/Main/SearchBar";
import useIsLoggedIn from "../components/hooks/useIsLoggedIn";

interface Book {
  id: number;
  title: string;
  coverImage: string;
  price: number;
  author: string;
  stocksAvailable: number;
  categories: { id: number; name: string }[];
}

const LIMIT = 50;

function AllItemBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addToCart } = useCart();
  const { isLoggedIn, mustBeLoggedIn, loading: loadLogin } = useIsLoggedIn();

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    setError(null);
    try {
      const response = await axios.get(`/api/books?method=newest&page=${currentPage}&limit=${LIMIT}`);
      console.log("API Response:", response.data);
      if (Array.isArray(response.data)) {
        setBooks(response.data);
        setTotalPages(Math.ceil(response.data.length / LIMIT));
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      setError("Error fetching books");
      console.error("Error fetching books:", error);
    }
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>, book: Book) => {
    event.preventDefault(); // ป้องกันการนำทางไปยังหน้ารายละเอียดหนังสือ
    event.stopPropagation(); // ป้องกันการ bubble ของ event

    if (loadLogin) return;
    mustBeLoggedIn();
    if (!isLoggedIn) return;

    const run = async () => {
      const item = cartItems.find((item) => item.id === book.id);
      await addToCart(book.id, item?.quantity ?? 0 + 1);
    };
    run();
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <SearchBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">หนังสือทั้งหมด</h1>
        {books.length === 0 && <div>No books available</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {books.map((book) => (
            <Link
              key={book.id}
              to={`/books/${encodeURIComponent(book.id)}`}
              className="flex flex-col items-center p-3 rounded-lg hover:shadow-lg transition duration-300"
            >
              <img
                src={DOMPurify.sanitize(book.coverImage)}
                alt={DOMPurify.sanitize(book.title)}
                className="w-36 h-48 object-cover mb-2"
              />
              <h3 className="text-md font-bold text-center mb-1 text-gray-800">
                {DOMPurify.sanitize(book.title)}
              </h3>
              <p className="text-xl font-bold text-gray-600">{Number(book.price).toFixed(2)} บาท</p>
              <p className="text-xs text-gray-500 mt-1">
                {DOMPurify.sanitize(book.categories.map((cat) => cat.name).join(", "))}
              </p>
              <button
                onClick={(e) => handleAddToCart(e, book)}
                className="mt-2 bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition duration-200 disabled:opacity-50"
                disabled={book.stocksAvailable < 1}
              >
                เพิ่มลงตะกร้า
              </button>
            </Link>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>
    </div>
  );
}

export default AllItemBook;
