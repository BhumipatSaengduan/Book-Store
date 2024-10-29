import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Main/Header";
import SearchBar from "../components/Main/SearchBar";
import useIsLoggedIn from "../components/hooks/useIsLoggedIn";
import { useNavigate } from "react-router-dom";

export function Button({ url, text }: { url: string; text: string }) {
  return (
    <Link to={url}>
      <div className="border border-black shadow-sm shadow-black rounded-lg text-2xl px-7 py-6">{text}</div>
    </Link>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const { loading, data } = useIsLoggedIn();

  useEffect(() => {
    if (loading) return;
    if (data?.role !== "admin") navigate("/");
  }, [loading, data]);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <SearchBar />
        {loading ? (
          <p>Loading...</p>
        ) : data?.role === "admin" && (
          <main className="mx-auto container mt-8 flex flex-col gap-6">
            <p className="font-semibold text-4xl px-9 text-[#385723]">พื้นที่จัดการ</p>
            <div className="flex gap-4 px-5 items-center justify-start">
              <Button url="/admin/categories" text="หมวดหมู่" />
              <Button url="/admin/books" text="หนังสือ" />
            </div>
          </main>
        )}
      </div>
    </>
  );
}
