import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Main/Header';
import SearchBar from '../components/Main/SearchBar';
import { useCart } from '../components/Main/CartProvider';
import Pagination from '../components/Main/Pagination';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';

interface Book {
  id: number;
  title: string;
  coverImage: string;
  price: number;
  author: string;
  categories: { id: number; name: string }[];
}

function AllItemBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    setError(null);
    try {
      const response = await axios.get(`/api/books?method=newest&page=${currentPage}&limit=15`);
      console.log('API Response:', response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setBooks(response.data);
        setTotalPages(Math.ceil(response.data.length / 15));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      setError('Error fetching books');
      console.error('Error fetching books:', error);  
    }
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>, book: Book) => {
    event.preventDefault(); // ป้องกันการนำทางไปยังหน้ารายละเอียดหนังสือ
    event.stopPropagation(); // ป้องกันการ bubble ของ event
    addToCart({
      id: book.id,
      name: book.title,
      price: book.price.toString(),
      quantity: 1,
    });
    toast.success(`เพิ่ม "${book.title}" ลงในตะกร้าแล้ว`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <SearchBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">หนังสือขายดี</h1>
        {books.length === 0 && <div>No books available</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {books.map((book) => (
            <Link
              key={book.id}
              to={`/book/${encodeURIComponent(book.id)}`}
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
              <p className="text-xl font-bold text-gray-600">
                {Number(book.price).toFixed(2)} บาท
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {DOMPurify.sanitize(book.categories.map(cat => cat.name).join(', '))}
              </p>
              <button
                onClick={(e) => handleAddToCart(e, book)}
                className="mt-2 bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition duration-200"
              >
                เพิ่มลงตะกร้า
              </button>
            </Link>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}

export default AllItemBook;
