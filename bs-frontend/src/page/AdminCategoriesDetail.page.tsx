import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Main/Header";
import SearchBar from "../components/Main/SearchBar";
import { useEffect, useState } from "react";
import useIsLoggedIn from "../components/hooks/useIsLoggedIn";

interface Category {
  id: number;
  name: string;
}

export default function AdminCategoriesDetail() {
  const navigate = useNavigate();
  const { loading, data, token } = useIsLoggedIn();

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [categoryId, setCategoryId] = useState<number | "new" | null>(null);
  const [error, setError] = useState<string>("");

  const [category, setCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({ id: 0, name: "" });
  const [dataError, setDataError] = useState<string>("");

  useEffect(() => {
    if (loading) return;
    if (data?.role !== "admin") navigate("/");
  }, [loading, data]);

  useEffect(() => {
    const param = id?.toLowerCase().trim();
    const asId = Number(param);
    if (param === "new") {
      setCategoryId(param);
    } else if (!Number.isNaN(asId) && asId > 0) {
      setCategoryId(asId);
    } else {
      setError("Failed to get category information: invalid/unknown category id");
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (categoryId === "new" || !categoryId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      const response = await fetch(`/api/categories/${categoryId}`);
      try {
        const json: Category = await response.json();
        setCategory(json);
        setFormData(json);
      } catch (error) {
        setError("Failed to get category information");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  const handleReset = () => {
    if (!category) return;
    setFormData(category);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "id") return;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/admin/categories");
    } catch (error) {
      console.error(error);
      setDataError("Failed to delete the item");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const run = async () => {
      const fail = `Failed to ${categoryId === "new" ? "add" : "update"} the item`;
      try {
        let response;
        if (categoryId === "new") {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _, ...data } = formData;
          response = await fetch("/api/categories", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        } else {
          const { id, ...data } = formData;
          response = await fetch(`/api/categories/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        }

        if (!response.ok) setDataError(fail);
        else navigate("/admin/categories");
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
                  <Link to="/admin/categories">หมวดหมู่</Link>
                </span>{" "}
                <span className="text-gray-700">
                  /{" "}
                  {!isLoading && !error ? (
                    <>
                      {category?.id ? (
                        <>
                          <span className="text-xl">{category?.id}</span> <span>{category?.name}</span>
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
                <div className="flex gap-3 items-center">
                  <label htmlFor="name" className="text-lg mr-3 w-32">
                    ชื่อหมวดหมู่<span className="text-red-700">*</span>:
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="border w-full rounded-md border-gray-300 px-2 py-1"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
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
                        {category?.id && (
                          <button
                            type="button"
                            className="border-2 border-[#385723] text-[#385723] text-xl px-5 py-2 rounded-lg"
                            onClick={handleReset}
                          >
                            รีเซ็ต
                          </button>
                        )}
                        <Link
                          to="/admin/categories"
                          className="border-2 border-gray-500 text-gray-500 text-xl px-5 py-2 rounded-lg"
                        >
                          ยกเลิก
                        </Link>
                        {category?.id && (
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
