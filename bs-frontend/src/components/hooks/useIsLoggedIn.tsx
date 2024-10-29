import { useEffect, useState } from "react";
import { type JwtPayload as JwtDecodePayload, jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type UseLoggedIn = {
  fetchState: () => void;
  loading: boolean;
  mustBeLoggedIn: () => void;
  mustBeAdmin: () => void;
} & (
  | { token: null; data: null; isLoggedIn: null }
  | { token: null; data: null; isLoggedIn: false }
  | { token: string; data: JwtPayload; isLoggedIn: true }
);

export interface JwtPayload extends JwtDecodePayload {
  id: number;
  role: "admin" | "regular";
}

export default function useLoggedIn() {
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [payload, setPayload] = useState<JwtPayload | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const reset = () => {
    setToken(null);
    setIsLoggedIn(false);
    setPayload(null);
  };

  const fetchState = () => {
    const fetched = localStorage.getItem("token");
    if (!fetched) {
      reset();
      setIsLoading(false);
    } else if (fetched === token) {
      /* empty */
    } else {
      try {
        const decoded = jwtDecode<JwtPayload>(fetched);
        setToken(fetched);
        setIsLoggedIn(true);
        setPayload(decoded);
      } catch (error) {
        reset();
        console.error(`failed to decode jwt: ${error}`);
        toast.error("เกิดข้อผิดพลาดขณะยืนยันตัวตน");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchState();
  });

  const mustBeLoggedIn = () => {
    if (!isLoggedIn) navigate("/Login");
  };

  const mustBeAdmin = () => {
    if (payload?.role !== "admin") navigate("/");
  };

  return {
    fetchState,
    loading: isLoading,
    isLoggedIn,
    token,
    data: payload,
    mustBeLoggedIn,
    mustBeAdmin,
  } as UseLoggedIn;
}
