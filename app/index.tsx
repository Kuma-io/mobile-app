import { usePrivy } from "@privy-io/expo";
import Homepage from "@/pages/home/page";
import LoginPage from "@/pages/login/page";
import { UserScreen } from "@/components/UserScreen";
import LoginScreen from "@/components/LoginScreen";

export default function Index() {
  const { user } = usePrivy();
  // return user ? <Homepage /> : <LoginPage />;
  return user ? <UserScreen /> : <LoginScreen />;
}
