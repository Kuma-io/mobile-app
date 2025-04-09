import { usePrivy } from "@privy-io/expo";
import Homepage from "@/pages/home/page";
import LoginPage from "@/pages/login/page";
import { useEffect } from "react";
import useProtocol from "@/store/useProtocol";
export default function Index() {
  const { user } = usePrivy();
  const { fetchApyHistory } = useProtocol();

  useEffect(() => {
    fetchApyHistory();
  }, []);
  return user ? <Homepage /> : <LoginPage />;
}
