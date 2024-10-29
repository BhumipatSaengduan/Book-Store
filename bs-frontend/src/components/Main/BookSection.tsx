import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

interface Book {
  id: number;
  title: string;
  coverImage: string;
  price: string;
  categories: { id: number; name: string }[];
}

interface BookSectionProps {
  title: string;
  method: 'newest' | 'best-selling';
}

const BookSection: React.FC<BookSectionProps> = React.memo(({ title, method }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch(`/api/books?method=${encodeURIComponent(method)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [method]);

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const linkTo = title === "หนังสือมาใหม่" ? "/NewBook" : "/BestSellerBook";

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold">{DOMPurify.sanitize(title)}</h2>
        <Link to={linkTo} className="text-black text-xl hover:underline">
          ดูทั้งหมด &gt;
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-5">
        {books.map((book) => (
          <Link 
            key={book.id} 
            to={`/books/${encodeURIComponent(book.id)}`} 
            className="flex flex-col items-center p-3 rounded-lg hover:shadow-lg transition duration-300"
          >
            <img src={DOMPurify.sanitize(book.coverImage)} alt={DOMPurify.sanitize(book.title)} className="w-36 h-48 object-cover mb-2" />
            <h3 className="text-md font-bold text-center mb-1 text-gray-800">{DOMPurify.sanitize(book.title)}</h3>
            <p className="text-2xl font-bold text-gray-600">{DOMPurify.sanitize(book.price)} บาท</p>
            <p className="text-xl text-gray-500 mt-1">
              {book.categories.map(cat => DOMPurify.sanitize(cat.name)).join(', ')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
});

export default BookSection;