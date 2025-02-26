import { usePrivy } from "@privy-io/expo";
import Homepage from "@/pages/home/page";
import LoginPage from "@/pages/login/page";

export default function Index() {
  const { user } = usePrivy();
  return user ? <Homepage /> : <LoginPage />;
}
