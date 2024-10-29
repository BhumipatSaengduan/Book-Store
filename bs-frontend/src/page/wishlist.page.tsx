import React, { useState, useEffect } from "react";
import Header from "../components/Main/Header";
import SearchBar from "../components/Main/SearchBar";
import axios from "axios";
import type { Book } from "../components/hooks/useBook";
import { Link } from "react-router-dom";
import useIsLoggedIn from "../components/hooks/useIsLoggedIn";

const Book: React.FC = () => {
  const [data, setData] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const { token, isLoggedIn, mustBeLoggedIn, loading: loadLogin } = useIsLoggedIn();

  useEffect(() => {
    if (loadLogin) return

    mustBeLoggedIn();
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/books/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        setError("Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, mustBeLoggedIn]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <SearchBar />

      <main className="mx-auto min-w-[90%] my-10">
        <p className="font-semibold text-4xl px-9 text-[#385723]">รายการที่ชอบ</p>
        <div className="mt-9 flex gap-5 flex-col justify-between items-center">
          {loading ? (
            <div>Loading...</div>
          ) : token === "" ? (
            <p>
              กรุณา<Link to="/login">เข้าสู่ระบบ</Link>
            </p>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <>
              {data?.map((b) => (
                <div className="flex items-center justify-between px-9 border w-full py-4">
                  <div className="flex gap-8 items-start">
                    <img src={b.coverImage} alt={`${b.title} book cover`} className="max-h-56" />
                    <div className="flex flex-col gap-4 items-start mt-7">
                      <p className="text-3xl font-bold truncate">{b.title}</p>
                      {/* {b.author && <p className="text-2xl">ผู้แต่ง: {b.author}</p>} */}
                      <p className="text-2xl">ราคา: ฿ {Number(b.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-9 my-auto">
                    <div className="border w-0 h-36 border-[#B3B3B3]"></div>
                    <div className="flex flex-col justify-center items-center gap-5">
                      <button
                        type="button"
                        className="text-3xl font-semibold w-72 bg-[#E2C9EF] py-3 rounded-lg"
                      >
                        หยิบใส่รถเข็น
                      </button>
                      <Link className="text-[#385729]" to={`/books/${b.id}`}>
                        อ่านเพิ่มเติม
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Book;
