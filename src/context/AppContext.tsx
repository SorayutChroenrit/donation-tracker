import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import {
  Campaign,
  Donation,
  WalletConnectionState,
  AppContextType,
} from "../types";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  HOLESKY_RPC_URL,
} from "../constants/contact";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [readonlyContract, setReadonlyContract] =
    useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);

  // Initialize readonly provider
  useEffect(() => {
    const setupReadonlyProvider = async () => {
      try {
        const readProvider = new ethers.JsonRpcProvider(HOLESKY_RPC_URL);
        console.log("Set up readonly provider for Holesky Testnet");

        const readContractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          readProvider
        );

        setReadonlyContract(readContractInstance);
        await loadCampaigns(readContractInstance);
      } catch (error) {
        console.error("Error setting up readonly provider:", error);
        toast.error("Failed to connect to Holesky Testnet");
      }
    };

    setupReadonlyProvider();
  }, []);

  const loadCampaigns = useCallback(
    async (contractInstance: ethers.Contract) => {
      try {
        setLoading(true);
        console.log("Loading campaigns...");

        const campaignCount = await contractInstance.getNumberOfCampaigns();
        console.log("Campaign count:", campaignCount.toString());

        const campaignsArray: Campaign[] = [];
        const count =
          typeof campaignCount.toNumber === "function"
            ? campaignCount.toNumber()
            : Number(campaignCount);

        for (let i = 0; i < count; i++) {
          try {
            const campaign = await contractInstance.getCampaign(i);

            const campaignObj: Campaign = {
              id: i,
              name: campaign[0],
              description: campaign[1],
              goal: ethers.formatEther(campaign[2]),
              amountRaised: ethers.formatEther(campaign[3]),
              isActive: campaign[4],
              campaignOwner: campaign[5],
              progress:
                campaign[2] > 0
                  ? Math.min(
                      100,
                      (Number(ethers.formatEther(campaign[3])) /
                        Number(ethers.formatEther(campaign[2]))) *
                        100
                    )
                  : 0,
            };

            campaignsArray.push(campaignObj);
          } catch (error) {
            console.error(`Error loading campaign ${i}:`, error);
          }
        }

        setCampaigns(campaignsArray);
      } catch (error) {
        console.error("Error in loadCampaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCampaign = async (
    name: string,
    description: string,
    goal: string
  ) => {
    if (!contract) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      const goalInWei = ethers.parseEther(goal);

      const tx = await contract.createCampaign(name, description, goalInWei, {
        gasLimit: 3000000,
      });

      console.log("Transaction sent:", tx.hash);
      toast.info(`Transaction submitted: ${tx.hash.substring(0, 10)}...`);

      await tx.wait();
      toast.success("Campaign created successfully!");

      if (contract) await loadCampaigns(contract);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  const makeDonation = async (
    campaignId: number,
    amount: string,
    message: string
  ) => {
    if (!contract) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      const amountInWei = ethers.parseEther(amount);

      const tx = await contract.donate(campaignId, message, {
        value: amountInWei,
        gasLimit: 3000000,
      });

      console.log("Transaction sent:", tx.hash);
      toast.info(`Transaction submitted: ${tx.hash.substring(0, 10)}...`);

      await tx.wait();
      toast.success(`Donated ${amount} ETH successfully!`);

      if (contract) await loadCampaigns(contract);
    } catch (error) {
      console.error("Error making donation:", error);
      toast.error("Failed to make donation");
    } finally {
      setLoading(false);
    }
  };

  const closeCampaign = async (campaignId: number) => {
    if (!contract) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.closeCampaign(campaignId, {
        gasLimit: 1000000,
      });

      console.log("Transaction sent:", tx.hash);
      toast.info(`Transaction submitted: ${tx.hash.substring(0, 10)}...`);

      await tx.wait();
      toast.success("Campaign closed successfully!");

      if (contract) await loadCampaigns(contract);
    } catch (error) {
      console.error("Error closing campaign:", error);
      toast.error("Failed to close campaign");
    } finally {
      setLoading(false);
    }
  };

  const withdrawFunds = async (campaignId: number) => {
    if (!contract) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.withdrawFunds(campaignId, {
        gasLimit: 1000000,
      });

      console.log("Transaction sent:", tx.hash);
      toast.info(`Transaction submitted: ${tx.hash.substring(0, 10)}...`);

      await tx.wait();
      toast.success("Funds withdrawn successfully!");

      if (contract) await loadCampaigns(contract);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds");
    } finally {
      setLoading(false);
    }
  };

  const getCampaignDonations = async (
    campaignId: number
  ): Promise<Donation[]> => {
    const contractToUse = contract || readonlyContract;

    if (!contractToUse) {
      toast.error("Cannot load donations data at this time");
      return [];
    }

    try {
      const donationsCount = await contractToUse.getCampaignDonationsCount(
        campaignId
      );
      const donationsArray: Donation[] = [];

      const count =
        typeof donationsCount.toNumber === "function"
          ? donationsCount.toNumber()
          : Number(donationsCount);

      for (let i = 0; i < count; i++) {
        try {
          const donation = await contractToUse.getCampaignDonation(
            campaignId,
            i
          );

          const donationObj: Donation = {
            donor: donation[0],
            amount: ethers.formatEther(donation[1]),
            timestamp:
              typeof donation[2].toNumber === "function"
                ? donation[2].toNumber()
                : Number(donation[2]),
            message: donation[3],
          };

          donationsArray.push(donationObj);
        } catch (error) {
          console.error(`Error processing donation ${i}:`, error);
        }
      }

      return donationsArray;
    } catch (error) {
      console.error(
        `Error loading donations for campaign ${campaignId}:`,
        error
      );
      toast.error("Failed to load donations");
      return [];
    }
  };

  const handleWalletConnect = async (walletState: WalletConnectionState) => {
    try {
      if (
        !walletState.provider ||
        !walletState.signer ||
        !walletState.selectedAccount
      ) {
        toast.error("Wallet connection failed");
        return;
      }

      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        walletState.signer
      );

      setProvider(walletState.provider);
      setSigner(walletState.signer);
      setContract(contractInstance);
      setAccount(walletState.selectedAccount.address);
      setConnected(true);

      await loadCampaigns(contractInstance);

      toast.success(
        `Connected: ${walletState.selectedAccount.address.substring(0, 6)}...`
      );
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Connection failed");
    }
  };

  return (
    <AppContext.Provider
      value={{
        provider,
        signer,
        contract,
        readonlyContract,
        account,
        campaigns,
        loading,
        connected,
        loadCampaigns,
        createCampaign,
        makeDonation,
        closeCampaign,
        withdrawFunds,
        getCampaignDonations,
        handleWalletConnect,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
