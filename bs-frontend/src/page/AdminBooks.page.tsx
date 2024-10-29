import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Main/Header";
import SearchBar from "../components/Main/SearchBar";
import { useEffect, useState } from "react";
import { type Book } from "../components/hooks/useBook";
import useIsLoggedIn from "../components/hooks/useIsLoggedIn";

export default function AdminCategories() {
  const navigate = useNavigate();
  const { loading, data } = useIsLoggedIn();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [books, setBooks] = useState<Book[]>();

  useEffect(() => {
    if (loading) return;
    if (data?.role !== "admin") navigate("/");
  }, [loading, data]);

  async function fetchData() {
    const response = await fetch("/api/books");
    try {
      const json: Book[] = await response.json();
      setBooks(json);
    } catch (error) {
      setError("Failed to get books");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <SearchBar />
        {loading ? (
          <p>Loading...</p>
        ) : data?.role === "admin" && (
          <main className="mx-auto container mt-8 flex flex-col gap-6">
            <div className="flex justify-between ml-9 mr-4">
              <div className="font-semibold text-4xl">
                <span className=" text-[#385723]">
                  <Link to="/admin">พื้นที่จัดการ</Link>
                </span>{" "}
                <span className="text-gray-700">/ หนังสือ</span>
              </div>
              {!isLoading && !error && (
                <Link to="/admin/books/new" className="rounded-lg text-white bg-[#385723] text-2xl px-5 py-2">
                  เพิ่ม
                </Link>
              )}
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {books?.map((b) => (
                    <Book key={b.id} book={b} />
                  ))}
                </div>
              </>
            )}
          </main>
        )}
      </div>
    </>
  );
}

function Book({ book }: { book: Book }) {
  const { token } = useIsLoggedIn();
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);

  const onClickDelete = async () => {
    const response = await fetch(`/api/books/${book.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      setIsDeleted(true);
    } else {
      try {
        console.error(await response.text());
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleted(false);
      }
    }
  };

  return (
    <div
      className={`px-6 py-3 rounded-lg w-full shadow-sm shadow-black border border-gray-800 flex items-center justify-between ${
        isDeleted ? "opacity-40" : ""
      }`}
    >
      <div>
        <span className="text-gray-500 text-sm mr-2">{book.id}</span>{" "}
        <span className="text-lg mr-6">{book.title}</span>
        <img src={book.coverImage} className="w-32 h-44 object-cover my-2 ml-5" />
      </div>
      <span className="text-sm text-gray-400">{book.categories.map((c) => c.name).join(", ")}</span>
      <div className="flex gap-3">
        {isDeleted === false ? (
          <p className="text-red-400 mr-6">ลบไม่สำเร็จ</p>
        ) : (
          isDeleted === true && <p className="text-[#385723]">ลบเสร็จสิ้น</p>
        )}
        {isDeleted !== true && (
          <>
            <Link to={`/admin/books/${book.id}`} className="text-[#385723]">
              แก้ไข
            </Link>
            <button type="button" className="text-red-500" onClick={onClickDelete}>
              ลบ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
