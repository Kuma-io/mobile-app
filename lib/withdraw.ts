import { publicClient } from "../utils/publicClient";
import { FACTORY_ADDRESS, FACTORY_ABI } from "../utils/contract";
import type { SmartWalletClientType } from "@privy-io/js-sdk-core/smart-wallets";
import { parseUnits } from "viem";
import { registerUserActions, registerUserPosition } from "./api";
const serverUrl = process.env.SERVER_URL;
const serverApiKey = process.env.SERVER_API_KEY;

export const withdraw = async (
  client: SmartWalletClientType,
  amount: number
) => {
  const txHash = await client.sendTransaction({
    account: client.account,
    calls: [
      {
        abi: FACTORY_ABI,
        functionName: "withdraw",
        to: FACTORY_ADDRESS,
        value: BigInt(0),
        args: [parseUnits(amount.toString(), 6)],
      },
    ],
  });
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (receipt.status === "success") {
    registerUserActions(client.account.address, "WITHDRAW", amount);
    await registerUserPosition(client.account.address);
    return receipt;
  } else {
    throw new Error("Transaction failed on the blockchain");
  }
};
