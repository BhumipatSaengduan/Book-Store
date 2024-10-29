import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Main/Header";
import SearchBar from "../components/Main/SearchBar";
import { useEffect, useState } from "react";
import { type Book } from "../components/hooks/useBook";
import { Category } from "./AdminCategories.page";
import useIsLoggedIn from "../components/hooks/useIsLoggedIn";

export default function AdminBooksDetail() {
  const { loading, data, token } = useIsLoggedIn();
  const navigate = useNavigate();

  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);

  const [bookId, setBookId] = useState<number | "new" | null>(null);
  const [error, setError] = useState<string>("");

  const [book, setBook] = useState<Book | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const [formData, setFormData] = useState<Omit<Book, "coverImage" | "categories" | "id">>({
    title: "",
    description: "",
    stocksAvailable: 0,
    sold: 0,
    price: 0,
  });
  const [bookCover, setBookCover] = useState<File | null>(null);
  const [categoryIds, setCategoryIds] = useState<Set<number>>(new Set());

  const [dataError, setDataError] = useState<string>("");

  useEffect(() => {
    if (loading) return;
    if (data?.role !== "admin") navigate("/");
  }, [loading, data]);

  useEffect(() => {
    const param = id?.toLowerCase().trim();
    const asId = Number(param);
    if (param === "new") {
      setBookId(param);
    } else if (!Number.isNaN(asId) && asId > 0) {
      setBookId(asId);
    } else {
      setError("Failed to get book information: invalid/unknown book id");
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (bookId === "new" || !bookId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      const response = await fetch(`/api/books/${bookId}`);
      try {
        const json: Book = await response.json();

        const { coverImage: _, categories, ...data } = json;

        setBook(json);

        setFormData(data);
        setCategoryIds(new Set(categories.map((c) => c.id)));
      } catch (error) {
        setError("Failed to get book information");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [bookId]);

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, []);

  const handleReset = () => {
    if (!book) return;
    setFormData(book);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      if (["stocksAvailable", "price"].includes(name)) {
        if (value === "") return { ...prevFormData, [name]: "" };
        return { ...prevFormData, [name]: Number(value) };
      }
      return { ...prevFormData, [name]: value };
    });
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/admin/books");
    } catch (error) {
      console.error(error);
      setDataError("Failed to delete the item");
    }
  };

  const handleCoverImage = (e: any) => {
    setBookCover(e.target.files[0]);
  };

  const handleCategories = (e: any) => {
    const value = Number(e.target.value);
    setCategoryIds(
      (prev) =>
        new Set(
          categoryIds.has(value) ? [...prev].filter((c) => c !== Number(value)) : [...prev, Number(value)]
        )
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const run = async () => {
      const fail = `Failed to ${bookId === "new" ? "add" : "update"} the item`;
      try {
        let response,
          coverImage = "";
        // upload cover image
        if (bookCover !== null) {
          const coverForm = new FormData();
          coverForm.append("cover", bookCover);
          response = await fetch("/api/books/upload-cover", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: coverForm,
          });

          const json = await response.json();
          coverImage = json.file;
        } else coverImage = book?.coverImage ?? ""

        const body = { ...formData, categoryIds: [...categoryIds], coverImage };

        if (bookId === "new") {
          response = await fetch("/api/books", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        } else {
          response = await fetch(`/api/books/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        }

        if (!response.ok) setDataError(fail);
        else navigate("/admin/books");
      } catch (error) {
        console.error(error);
        setDataError(fail);
      }
    };
    run();
  };

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
                <span className="text-gray-700">/</span>{" "}
                <span className=" text-[#385723]">
                  <Link to="/admin/books">หนังสือ</Link>
                </span>{" "}
                <span className="text-gray-700">
                  /{" "}
                  {!isLoading && !error ? (
                    <>
                      {book?.id ? (
                        <>
                          <span className="text-xl">{book?.id}</span> <span>{book?.title}</span>
                        </>
                      ) : (
                        <span className="italic text-3xl">สร้างใหม่</span>
                      )}
                    </>
                  ) : (
                    "???"
                  )}
                </span>
              </div>
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <form className="flex flex-col gap-3 pr-5" onSubmit={handleSubmit}>
                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="title" className="text-lg whitespace-nowrap">
                    ชื่อหนังสือ<span className="text-red-700">*</span>:
                  </label>
                  <input
                    id="title"
                    name="title"
                    maxLength={255}
                    className="border w-5/6 rounded-md border-gray-300 px-2 py-1"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <label htmlFor="cover" className="text-lg mr-[7.4rem] whitespace-nowrap">
                    ปกหนังสือ:
                  </label>
                  <input
                    type="file"
                    id="cover"
                    name="cover"
                    accept="image/png,image/jpeg"
                    onChange={handleCoverImage}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="name" className="text-lg whitespace-nowrap">
                    คำอธิบาย:
                  </label>
                  <input
                    id="description"
                    name="description"
                    maxLength={1023}
                    className="border rounded-md border-gray-300 px-2 py-1 w-5/6"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="name" className="text-lg whitespace-nowrap">
                    จำนวนในสต็อก:
                  </label>
                  <input
                    id="stocksAvailable"
                    name="stocksAvailable"
                    type="number"
                    min="0"
                    className="border rounded-md border-gray-300 px-2 py-1 w-5/6"
                    value={formData.stocksAvailable}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="name" className="text-lg whitespace-nowrap">
                    ราคา:
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="border rounded-md border-gray-300 px-2 py-1 w-5/6"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                {categories && categories.length > 0 && (
                  <div className="flex gap-3 items-start">
                    <label htmlFor="categories" className="text-lg mr-32 whitespace-nowrap">
                      หมวดหมู่:
                    </label>
                    <div className="flex flex-col gap-1">
                      {categories!.map((c) => (
                        <div key={c.id} className="flex gap-2">
                          <input
                            type="checkbox"
                            name="categories"
                            id="categories"
                            value={c.id}
                            checked={categoryIds.has(c.id)}
                            onChange={handleCategories}
                          />
                          {c.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center flex-row-reverse justify-between">
                  <div className="flex items-center flex-row-reverse gap-3">
                    {!isLoading && !error && (
                      <>
                        <button
                          type="submit"
                          className="text-white bg-[#385723] text-xl px-5 py-2 rounded-lg"
                        >
                          บันทึก
                        </button>
                        {book?.id && (
                          <button
                            type="button"
                            className="border-2 border-[#385723] text-[#385723] text-xl px-5 py-2 rounded-lg"
                            onClick={handleReset}
                          >
                            รีเซ็ต
                          </button>
                        )}
                        <Link
                          to="/admin/books"
                          className="border-2 border-gray-500 text-gray-500 text-xl px-5 py-2 rounded-lg"
                        >
                          ยกเลิก
                        </Link>
                        {book?.id && (
                          <button
                            type="button"
                            className="bg-red-700 text-white text-xl px-5 py-2 rounded-lg"
                            onClick={handleDelete}
                          >
                            ลบ
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <span className="text-red-700">{dataError}</span>
                </div>
              </form>
            )}
          </main>
        )}
      </div>
    </>
  );
}
