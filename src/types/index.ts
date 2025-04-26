import { ethers } from "ethers";

export interface Campaign {
  id: number;
  name: string;
  description: string;
  goal: string;
  amountRaised: string;
  isActive: boolean;
  campaignOwner: string;
  progress: number;
}

export interface Account {
  address: string;
  balance: string;
  name?: string;
}

export interface Donation {
  donor: string;
  amount: string;
  timestamp: number;
  message: string;
}

export type WalletConnectionState = {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  accounts: Account[];
  selectedAccount: Account | null;
  chainId: number | null;
  connected: boolean;
  loading: boolean;
};

export interface AppContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  readonlyContract: ethers.Contract | null;
  account: string;
  campaigns: Campaign[];
  loading: boolean;
  connected: boolean;
  loadCampaigns: (contractInstance: ethers.Contract) => Promise<void>;
  createCampaign: (
    name: string,
    description: string,
    goal: string
  ) => Promise<void>;
  makeDonation: (
    campaignId: number,
    amount: string,
    message: string
  ) => Promise<void>;
  closeCampaign: (campaignId: number) => Promise<void>;
  withdrawFunds: (campaignId: number) => Promise<void>;
  getCampaignDonations: (campaignId: number) => Promise<Donation[]>;
  handleWalletConnect: (walletState: WalletConnectionState) => Promise<void>;
}
