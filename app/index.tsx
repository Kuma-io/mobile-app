import { usePrivy } from "@privy-io/expo";
import Homepage from "@/pages/home/page";
import LoginPage from "@/pages/login/page";
import { useEffect } from "react";
import useAave from "@/store/useAave";
export default function Index() {
  const { user } = usePrivy();
  const { getApyHistory } = useAave();

  useEffect(() => {
    getApyHistory();
  }, []);
  return user ? <Homepage /> : <LoginPage />;
}
