import { publicClient } from "../utils/publicClient";
import { FACTORY_ADDRESS, FACTORY_ABI, USDC_ADDRESS } from "../utils/contract";
import type { SmartWalletClientType } from "@privy-io/js-sdk-core/smart-wallets";
import { parseUnits, erc20Abi } from "viem";
import { registerUserActions, registerUserPosition } from "./api";
const serverUrl = process.env.SERVER_URL;
const serverApiKey = process.env.SERVER_API_KEY;

export const transfer = async (
  client: SmartWalletClientType,
  amount: number
) => {
  const txHash = await client.sendTransaction({
    account: client.account,
    calls: [
      {
        abi: erc20Abi,
        functionName: "transfer",
        to: USDC_ADDRESS,
        value: BigInt(0),
        args: [
          "0x1f29312f134C79984bA4b21840f2C3DcF57b9c85",
          parseUnits(amount.toString(), 6),
        ],
      },
    ],
  });
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  // Check if the transaction was successful
  if (receipt.status === "success") {
    await registerUserPosition(client.account.address);
    return receipt;
  } else {
    throw new Error("Transaction failed on the blockchain");
  }
};
