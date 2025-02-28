import { usePrivy } from "@privy-io/expo";
import Homepage from "@/pages/home/page";
import LoginPage from "@/pages/login/page";
import { useEffect } from "react";
import useStore from "@/store/useStore";
export default function Index() {
  const { user } = usePrivy();
  const { fetchApyHistory } = useStore();

  useEffect(() => {
    fetchApyHistory();
  }, []);
  return user ? <Homepage /> : <LoginPage />;
}
