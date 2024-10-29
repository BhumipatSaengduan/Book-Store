import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Main/Header";
import SearchBar from "../components/Main/SearchBar";
import { useEffect, useState } from "react";
import useIsLoggedIn from "../components/hooks/useIsLoggedIn";

export interface Category {
  id: number;
  name: string;
}

export default function AdminCategories() {
  const navigate = useNavigate();
  const { loading, data } = useIsLoggedIn();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    if (loading) return;
    if (data?.role !== "admin") navigate("/");
  }, [loading, data]);

  async function fetchData() {
    const response = await fetch("/api/categories");
    try {
      const json: Category[] = await response.json();
      setCategories(json);
    } catch (error) {
      setError("Failed to get categories");
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
        ) : (
          data?.role === "admin" && (
            <main className="mx-auto container mt-8 flex flex-col gap-6">
              <div className="flex justify-between ml-9 mr-4">
                <div className="font-semibold text-4xl">
                  <span className=" text-[#385723]">
                    <Link to="/admin">พื้นที่จัดการ</Link>
                  </span>{" "}
                  <span className="text-gray-700">/ หมวดหมู่</span>
                </div>
                {!isLoading && !error && (
                  <Link
                    to="/admin/categories/new"
                    className="rounded-lg text-white bg-[#385723] text-2xl px-5 py-2"
                  >
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
                    {categories?.map((c) => (
                      <Category key={c.id} category={c} />
                    ))}
                  </div>
                </>
              )}
            </main>
          )
        )}
      </div>
    </>
  );
}

function Category({ category: { id, name } }: { category: Category }) {
  const { token } = useIsLoggedIn();
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);

  const onClickDelete = async () => {
    const response = await fetch(`/api/categories/${id}`, {
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
        <span className="text-gray-500 text-sm mr-2">{id}</span> <span className="text-lg">{name}</span>
      </div>
      <div className="flex gap-3">
        {isDeleted === false ? (
          <p className="text-red-400 mr-6">ลบไม่สำเร็จ</p>
        ) : (
          isDeleted === true && <p className="text-[#385723]">ลบเสร็จสิ้น</p>
        )}
        {isDeleted !== true && (
          <>
            <Link to={`/admin/categories/${id}`} className="text-[#385723]">
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
