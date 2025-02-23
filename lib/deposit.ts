import { publicClient } from "../utils/publicClient";
import { FACTORY_ADDRESS, FACTORY_ABI, USDC_ADDRESS } from "../utils/contract";
import type { SmartWalletClientType } from "@privy-io/js-sdk-core/smart-wallets";
import { parseUnits, erc20Abi } from "viem";
import { registerUserActions, registerUserPosition } from "./api";
const serverUrl = process.env.SERVER_URL;
const serverApiKey = process.env.SERVER_API_KEY;

export const deposit = async (
  client: SmartWalletClientType,
  amount: number
) => {
  const txHash = await client.sendTransaction({
    account: client.account,
    calls: [
      {
        abi: erc20Abi,
        functionName: "approve",
        to: USDC_ADDRESS,
        value: BigInt(0),
        args: [FACTORY_ADDRESS, parseUnits(amount.toString(), 6)],
      },
      {
        abi: FACTORY_ABI,
        functionName: "deposit",
        to: FACTORY_ADDRESS,
        value: BigInt(0),
        args: [parseUnits(amount.toString(), 6)],
      },
    ],
  });
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  // Check if the transaction was successful
  if (receipt.status === "success") {
    registerUserActions(client.account.address, "DEPOSIT", amount);
    await registerUserPosition(client.account.address);
    return receipt;
  } else {
    throw new Error("Transaction failed on the blockchain");
  }
};
