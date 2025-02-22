import { arbitrumSepolia } from "viem/chains";
import { publicClient } from "./publicClient";
import type { SmartWalletClientType } from "@privy-io/js-sdk-core/smart-wallets";

export const deposit = async (
  client: SmartWalletClientType,
  amount: number
) => {
  const txHash = await client.sendTransaction({
    account: client.account,
    chain: arbitrumSepolia,
    to: "0x1f29312f134C79984bA4b21840f2C3DcF57b9c85",
    value: BigInt(amount),
  });
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  return receipt;
};
