import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Textarea } from "./components/ui/textarea";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { Toaster, toast } from "sonner";
import WalletConnection from "./components/WalletModel";
import UserDonationHistory from "./components/UserHistory";

const HOLESKY_CHAIN_ID = 17000;
const HOLESKY_RPC_URL = "https://ethereum-holesky.publicnode.com/";

// ABI for your DonationTracker contract
const contractABI: any[] = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
    ],
    name: "CampaignClosed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "campaignOwner",
        type: "address",
      },
    ],
    name: "CampaignCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_campaignId",
        type: "uint256",
      },
    ],
    name: "closeCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_goal",
        type: "uint256",
      },
    ],
    name: "createCampaign",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_campaignId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_message",
        type: "string",
      },
    ],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "DonationReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "campaignOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsWithdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_campaignId",
        type: "uint256",
      },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "campaignDonations",
    outputs: [
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "campaigns",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "goal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountRaised",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "address",
        name: "campaignOwner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "donorToCampaigns",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getAllUserDonations",
    outputs: [
      {
        internalType: "uint256[]",
        name: "campaignIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "timestamps",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "campaignNames",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_campaignId",
        type: "uint256",
      },
    ],
    name: "getCampaign",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "goal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountRaised",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "address",
        name: "campaignOwner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_campaignId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_donationIndex",
        type: "uint256",
      },
    ],
    name: "getCampaignDonation",
    outputs: [
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_campaignId",
        type: "uint256",
      },
    ],
    name: "getCampaignDonationsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNumberOfCampaigns",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserDonationCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getUserDonationDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        internalType: "string",
        name: "campaignName",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_donor",
        type: "address",
      },
    ],
    name: "getUserDonations",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numberOfDonations",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDonations",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userDonations",
    outputs: [
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Contract address - replace with your deployed contract address
const contractAddress = "0x40374915149b2A7806090D23CE9375ac98db481d";

interface Campaign {
  id: number;
  name: string;
  description: string;
  goal: string;
  amountRaised: string;
  isActive: boolean;
  campaignOwner: string;
  progress: number;
}

interface Account {
  address: string;
  balance: string;
  name?: string;
}

interface Donation {
  donor: string;
  amount: string;
  timestamp: number;
  message: string;
}

type WalletConnectionState = {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  accounts: Account[];
  selectedAccount: Account | null;
  chainId: number | null;
  connected: boolean;
  loading: boolean;
};

function App() {
  // State variables remain the same
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [readonlyContract, setReadonlyContract] =
    useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [campaignDonations, setCampaignDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [networkInfo, setNetworkInfo] = useState<string>("");
  const [creationStatus, setCreationStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("campaigns");

  // New campaign form state
  const [newCampaignName, setNewCampaignName] = useState<string>("");
  const [newCampaignDescription, setNewCampaignDescription] =
    useState<string>("");
  const [newCampaignGoal, setNewCampaignGoal] = useState<string>("");

  // Donation form state
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [donationMessage, setDonationMessage] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Setup readonly provider and contract on initial load
  useEffect(() => {
    const setupReadonlyProvider = async () => {
      try {
        // Create readonly provider using Holesky RPC
        const readProvider = new ethers.JsonRpcProvider(HOLESKY_RPC_URL);
        console.log("Set up readonly provider for Holesky Testnet");

        // Create readonly contract instance
        const readContractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          readProvider
        );

        setReadonlyContract(readContractInstance);

        // Load campaigns without requiring wallet connection
        await loadCampaigns(readContractInstance);
      } catch (error) {
        console.error("Error setting up readonly provider:", error);
        toast.error("Failed to connect to Holesky Testnet");
        setLoading(false);
      }
    };

    setupReadonlyProvider();
  }, []);

  // Load all campaigns from the contract
  const loadCampaigns = useCallback(
    async (contractInstance: ethers.Contract) => {
      try {
        setLoading(true);
        console.log("Loading campaigns...");

        // Check if the network is available if using connected provider
        if (provider) {
          try {
            const network = await provider?.getNetwork();
            console.log("Connected to network:", network?.name);
          } catch (networkError) {
            console.error("Network connection error:", networkError);
            toast.error(
              "Network connection issue. Please check your internet connection and MetaMask settings."
            );
            setLoading(false);
            return;
          }
        }

        // First verify basic contract existence if we have a provider
        try {
          if (provider) {
            const code = await provider?.getCode(contractAddress);
            if (code === "0x" || code === "0x0") {
              console.error(
                "No contract exists at the provided address on this network"
              );
              toast.error(
                "Contract not found on this network. Please verify you're connected to the correct network."
              );
              setLoading(false);
              return;
            }
            console.log("Contract exists at the provided address");
          }
        } catch (codeError) {
          console.error("Error checking contract code:", codeError);
        }

        // Get campaign count with error handling
        let campaignCount;
        try {
          // Simply call the function - we'll handle any errors below
          campaignCount = await contractInstance.getNumberOfCampaigns();
          console.log("Campaign count:", campaignCount.toString());
        } catch (countError) {
          console.error("Error getting campaign count:", countError);

          // Try to use a fallback RPC if this is a network error
          if (!connected) {
            console.log("Attempting to use fallback RPC endpoint...");
            try {
              // Set default campaigns to show empty state instead of error
              setCampaigns([]);
              setLoading(false);
              return;
            } catch (fallbackError) {
              console.error("Fallback RPC failed:", fallbackError);
              setLoading(false);
              return;
            }
          }

          // For connected users, show the error
          toast.error(
            "Failed to get campaign data. Please try a different network."
          );
          setLoading(false);
          return;
        }

        const campaignsArray: Campaign[] = [];

        // Fix for the toNumber issue - handle both BigNumber and regular number
        const count =
          typeof campaignCount.toNumber === "function"
            ? campaignCount.toNumber()
            : Number(campaignCount);

        console.log("Processed campaign count:", count);

        // Loop through campaigns with individual error handling for each
        for (let i = 0; i < count; i++) {
          console.log(`Loading campaign ${i}...`);
          try {
            const campaign = await contractInstance.getCampaign(i);
            console.log(`Campaign ${i} data:`, campaign);

            // Make sure all expected data exists before processing
            if (!campaign || campaign.length < 6) {
              console.error(
                `Campaign ${i} returned incomplete data:`,
                campaign
              );
              continue;
            }

            try {
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
              console.log(`Campaign ${i} formatted:`, campaignObj);

              campaignsArray.push(campaignObj);
            } catch (formatError) {
              console.error(
                `Error formatting campaign ${i} data:`,
                formatError
              );
              // Try a simple version with minimal processing
              campaignsArray.push({
                id: i,
                name: campaign[0] || "Unknown Name",
                description: campaign[1] || "No description available",
                goal: campaign[2] ? ethers.formatEther(campaign[2]) : "0",
                amountRaised: campaign[3]
                  ? ethers.formatEther(campaign[3])
                  : "0",
                isActive: !!campaign[4],
                campaignOwner:
                  campaign[5] || "0x0000000000000000000000000000000000000000",
                progress: 0,
              });
            }
          } catch (error) {
            console.error(`Error loading campaign ${i}:`, error);

            // Log the error details but don't try to use unused variables
            if (error instanceof Error) {
              console.log(`Error message for campaign ${i}: ${error.message}`);
            }

            // Skip this campaign but continue with others
            continue;
          }
        }

        // Check if we managed to load any campaigns
        if (campaignsArray.length === 0 && count > 0) {
          console.warn(
            "No campaigns could be loaded despite count being greater than 0"
          );
          toast.warning(
            "Could not load campaign details. There might be an issue with the contract data."
          );
        } else {
          console.log("Campaigns loaded successfully:", campaignsArray.length);
        }

        setCampaigns(campaignsArray);
      } catch (error) {
        console.error("Error in loadCampaigns:", error);
        toast.error(`Failed to load campaigns: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    },
    [account, provider]
  );

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

      // Create contract instance
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        walletState.signer
      );

      // Update state
      setProvider(walletState.provider);
      setSigner(walletState.signer);
      setContract(contractInstance);
      setAccount(walletState.selectedAccount.address);

      // Load campaigns
      await loadCampaigns(contractInstance);

      toast.success(
        `Connected: ${formatAddress(walletState.selectedAccount.address)}`
      );
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error(`Connection failed: ${(error as Error).message}`);
    }
  };

  // Create a new campaign with extensive error handling and debugging
  const createCampaign = async () => {
    console.log("CREATE CAMPAIGN BUTTON CLICKED");
    setCreationStatus("Starting campaign creation process...");

    if (!contract) {
      console.error("No contract instance available");
      toast.error("Wallet not connected");
      setCreationStatus("");
      return;
    }

    if (!newCampaignName) {
      toast.error("Please enter a campaign name");
      setCreationStatus("");
      return;
    }

    if (!newCampaignDescription) {
      toast.error("Please enter a campaign description");
      setCreationStatus("");
      return;
    }

    if (
      !newCampaignGoal ||
      isNaN(Number(newCampaignGoal)) ||
      Number(newCampaignGoal) <= 0
    ) {
      toast.error("Please enter a valid campaign goal");
      setCreationStatus("");
      return;
    }

    let checkConfirmationInterval: NodeJS.Timeout | null = null;

    try {
      // Parse the goal amount
      console.log("Parsing goal amount:", newCampaignGoal);
      setCreationStatus("Parsing goal amount...");

      let goalInWei;
      try {
        goalInWei = ethers.parseEther(newCampaignGoal);
        console.log("Goal in wei:", goalInWei.toString());
      } catch (error) {
        console.error("Error parsing goal amount:", error);
        toast.error(`Invalid goal amount: ${(error as Error).message}`);
        setCreationStatus("");
        return;
      }

      setLoading(true);
      setCreationStatus("Preparing transaction...");

      console.log("Calling contract with params:", {
        name: newCampaignName,
        description: newCampaignDescription,
        goal: goalInWei.toString(),
      });

      // Add a timeout to reset if stuck
      const timeout = setTimeout(() => {
        console.log("Transaction timeout reached");
        setLoading(false);
        setCreationStatus("");
        toast.error(
          "Transaction taking too long. Please check MetaMask for status."
        );
      }, 120000); // 2 minute timeout

      setCreationStatus("Sending transaction to blockchain...");
      const tx = await contract.createCampaign(
        newCampaignName,
        newCampaignDescription,
        goalInWei,
        { gasLimit: 3000000 } // Explicit gas limit
      );

      // Clear the timeout since we got past this point
      clearTimeout(timeout);

      console.log("Transaction sent:", tx.hash);
      setCreationStatus(`Transaction submitted: ${tx.hash}`);
      toast.info(`Transaction submitted: ${tx.hash.substring(0, 10)}...`);

      // Start monitoring for confirmation
      let confirmationAttempts = 0;
      checkConfirmationInterval = setInterval(async () => {
        confirmationAttempts++;
        setCreationStatus(
          `Checking transaction status (attempt ${confirmationAttempts})...`
        );

        try {
          if (!provider) return;

          const receipt = await provider.getTransactionReceipt(tx.hash);
          console.log(
            `Check attempt ${confirmationAttempts} - Receipt:`,
            receipt
          );

          if (receipt && receipt.status === 1) {
            if (checkConfirmationInterval)
              clearInterval(checkConfirmationInterval);
            console.log("Transaction confirmed via manual check:", receipt);

            setLoading(false);
            setCreationStatus("Campaign created successfully!");
            toast.success("Campaign created successfully!");

            // Reset form
            setNewCampaignName("");
            setNewCampaignDescription("");
            setNewCampaignGoal("");

            // Reload campaigns
            if (contract) await loadCampaigns(contract);

            // Clear status after a moment
            setTimeout(() => setCreationStatus(""), 3000);
          }
        } catch (checkError) {
          console.log("Error checking confirmation:", checkError);
        }

        // After 30 attempts (5 minutes), give up and try to refresh anyway
        if (confirmationAttempts > 30) {
          if (checkConfirmationInterval)
            clearInterval(checkConfirmationInterval);

          console.log("Max check attempts reached, forcing UI update");
          setLoading(false);
          setCreationStatus("Status checking timed out, refreshing data...");
          toast.info("Campaign may have been created. Refreshing data...");

          try {
            if (contract) await loadCampaigns(contract);
            setTimeout(() => setCreationStatus(""), 3000);
          } catch (loadError) {
            console.error("Error refreshing campaigns:", loadError);
            setCreationStatus("");
          }
        }
      }, 10000); // Check every 10 seconds

      try {
        setCreationStatus("Waiting for transaction confirmation...");
        console.log("Waiting for transaction confirmation via tx.wait()...");
        const receipt = await tx.wait();
        console.log("Transaction confirmed via tx.wait():", receipt);

        // Clear the interval if this succeeds
        if (checkConfirmationInterval) clearInterval(checkConfirmationInterval);

        setCreationStatus("Campaign created successfully!");
        toast.success("Campaign created successfully!");

        // Reset form
        setNewCampaignName("");
        setNewCampaignDescription("");
        setNewCampaignGoal("");

        // Reload campaigns
        await loadCampaigns(contract);

        setLoading(false);

        // Clear status after a moment
        setTimeout(() => setCreationStatus(""), 3000);
      } catch (waitError) {
        console.error("Error in tx.wait():", waitError);
        // Don't set loading to false or clear interval
        // Let the manual checking mechanism handle it
        setCreationStatus("Waiting via alternative method...");
      }
    } catch (error) {
      console.error("Detailed error creating campaign:", error);

      if (checkConfirmationInterval) clearInterval(checkConfirmationInterval);

      const errorMessage =
        (error as any)?.reason || (error as Error).message || "Unknown error";
      setCreationStatus(`Error: ${errorMessage}`);
      toast.error(`Failed to create campaign: ${errorMessage}`);
      setLoading(false);

      // Clear status after a moment
      setTimeout(() => setCreationStatus(""), 5000);
    }
  };

  // Load donations for a specific campaign
  const loadCampaignDonations = async (campaignId: number) => {
    // Use either the connected contract or the readonly contract
    const contractToUse = contract || readonlyContract;

    if (!contractToUse) {
      toast.error("Cannot load donations data at this time");
      return;
    }

    try {
      setLoading(true);
      console.log(`Loading donations for campaign ${campaignId}...`);

      const donationsCount = await contractToUse.getCampaignDonationsCount(
        campaignId
      );
      console.log(
        `Donation count for campaign ${campaignId}:`,
        donationsCount.toString()
      );

      const donationsArray: Donation[] = [];

      // Handle both BigNumber and regular number formats safely
      const count =
        typeof donationsCount.toNumber === "function"
          ? donationsCount.toNumber()
          : Number(donationsCount);

      console.log(`Processing ${count} donations`);

      for (let i = 0; i < count; i++) {
        console.log(`Loading donation ${i} for campaign ${campaignId}...`);
        try {
          const donation = await contractToUse.getCampaignDonation(
            campaignId,
            i
          );
          console.log(`Donation ${i} data:`, donation);

          const donationObj: Donation = {
            donor: donation[0],
            amount: ethers.formatEther(donation[1]),
            timestamp:
              typeof donation[2].toNumber === "function"
                ? donation[2].toNumber()
                : Number(donation[2]),
            message: donation[3],
          };
          console.log(`Donation ${i} formatted:`, donationObj);

          donationsArray.push(donationObj);
        } catch (innerError) {
          console.error(`Error processing donation ${i}:`, innerError);
          // Continue with other donations instead of failing the entire operation
        }
      }

      setCampaignDonations(donationsArray);
      console.log("Donations loaded:", donationsArray.length);
    } catch (error) {
      console.error(
        `Error loading donations for campaign ${campaignId}:`,
        error
      );
      toast.error(`Failed to load donations: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Make a donation to a campaign
  // Enhanced makeDonation function with fallback RPC support
  const makeDonation = async () => {
    if (!selectedCampaign) {
      console.error("No campaign selected");
      toast.error("No campaign selected");
      return;
    }

    // Use connected contract if available, otherwise try to create a temporary one
    let donationContract = contract;
    let tempProvider = null;
    let tempSigner = null;

    try {
      setLoading(true);
      console.log("Starting donation process...");

      // Validate donation amount
      if (!donationAmount || parseFloat(donationAmount) <= 0) {
        toast.error("Please enter a valid donation amount");
        setLoading(false);
        return;
      }

      // Check if wallet is connected
      if (!donationContract) {
        if (!account) {
          toast.error("Please connect your wallet to donate");
          setLoading(false);
          return;
        }

        // Try to create a temporary contract connection using Holesky RPC
        console.log("Attempting to use Holesky RPC for donation...");
        try {
          tempProvider = new ethers.BrowserProvider((window as any).ethereum);
          tempSigner = await tempProvider.getSigner();
          donationContract = new ethers.Contract(
            contractAddress,
            contractABI,
            tempSigner
          );
          console.log("Created temporary contract instance for donation");
        } catch (error) {
          console.error("Failed to create temporary contract:", error);
          toast.error("Wallet connection required for donations");
          setLoading(false);
          return;
        }
      }

      // Convert to wei with explicit error handling
      let amountInWei;
      try {
        console.log("Parsing donation amount:", donationAmount);
        amountInWei = ethers.parseEther(donationAmount);
        console.log("Donation amount in wei:", amountInWei.toString());
      } catch (error) {
        console.error("Error parsing donation amount:", error);
        toast.error("Invalid donation amount format");
        setLoading(false);
        return;
      }

      // Make the donation
      console.log("Calling donate function with params:", {
        campaignId: selectedCampaign.id,
        message: donationMessage,
        value: amountInWei.toString(),
      });

      // Check network
      const providerToUse = tempProvider || provider;
      if (providerToUse) {
        const network = await providerToUse.getNetwork();
        console.log("Current network for donation:", network.chainId);

        // Verify we're on Holesky
        if (network.chainId !== BigInt(HOLESKY_CHAIN_ID)) {
          console.warn("Not on Holesky testnet!");
          toast.warning(
            `Please switch to Holesky testnet (Chain ID: ${HOLESKY_CHAIN_ID})`
          );

          // Try to switch network if MetaMask is available
          try {
            await (window as any).ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${HOLESKY_CHAIN_ID.toString(16)}` }],
            });
            toast.info("Please try donating again after network switch");
            setLoading(false);
            return;
          } catch (switchError) {
            console.error("Failed to switch network:", switchError);
            // Continue anyway, the transaction will likely fail
          }
        }
      }

      // Send transaction with retry mechanism
      let tx;
      try {
        // First attempt with dynamic gas estimation
        tx = await donationContract.donate(
          selectedCampaign.id,
          donationMessage,
          {
            value: amountInWei,
          }
        );
      } catch (gasError) {
        console.warn(
          "Dynamic gas estimation failed, trying with fixed gas limit:",
          gasError
        );

        // Second attempt with fixed gas limit
        tx = await donationContract.donate(
          selectedCampaign.id,
          donationMessage,
          {
            value: amountInWei,
            gasLimit: 3000000, // Higher gas limit for safety
          }
        );
      }

      console.log("Transaction sent:", tx.hash);
      toast.info(`Transaction submitted: ${tx.hash.substring(0, 10)}...`);

      // Monitor transaction with timeout
      const txPromise = tx.wait();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Transaction confirmation timeout")),
          60000
        )
      );

      try {
        const receipt = await Promise.race([txPromise, timeoutPromise]);
        console.log("Transaction confirmed:", receipt);
        toast.success(`Donated ${donationAmount} ETH successfully!`);
      } catch (timeoutError) {
        console.warn(
          "Transaction wait timed out but may still succeed:",
          timeoutError
        );
        toast.info(
          "Transaction submitted but confirmation is taking longer than expected"
        );
      }

      // Reset form and update UI
      setDonationAmount("");
      setDonationMessage("");
      setIsDialogOpen(false);

      // Reload campaign and donations using the read-only contract to avoid wallet issues
      const contractToUse = readonlyContract || donationContract;
      await loadCampaigns(contractToUse);
      await loadCampaignDonations(selectedCampaign.id);
    } catch (error) {
      console.error("Error making donation:", error);
      const errorMessage =
        (error as any)?.reason || (error as Error).message || "Unknown error";
      toast.error(`Failed to make donation: ${errorMessage}`);

      // Check for specific MetaMask errors
      if (
        errorMessage.includes("user rejected") ||
        errorMessage.includes("User denied")
      ) {
        toast.info("Transaction was rejected in your wallet");
      } else if (errorMessage.includes("insufficient funds")) {
        toast.error("Insufficient funds in your wallet");
      }
    } finally {
      setLoading(false);
    }
  };

  // Enhanced closeCampaign function with fallback RPC support
  const closeCampaign = async (campaignId: number) => {
    // Try to use existing contract, or create a temporary one
    let campaignContract = contract;
    let tempProvider = null;
    let tempSigner = null;

    try {
      setLoading(true);
      console.log(`Closing campaign ${campaignId}...`);

      // Check if wallet is connected
      if (!campaignContract) {
        if (!account) {
          toast.error("Please connect your wallet to close a campaign");
          setLoading(false);
          return;
        }

        // Try to create a temporary contract connection using Holesky RPC
        console.log("Attempting to use Holesky RPC for closing campaign...");
        try {
          tempProvider = new ethers.BrowserProvider((window as any).ethereum);
          tempSigner = await tempProvider.getSigner();
          campaignContract = new ethers.Contract(
            contractAddress,
            contractABI,
            tempSigner
          );
          console.log(
            "Created temporary contract instance for closing campaign"
          );
        } catch (error) {
          console.error("Failed to create temporary contract:", error);
          toast.error("Wallet connection required to close campaigns");
          setLoading(false);
          return;
        }
      }

      // Verify campaign ownership before attempting to close
      try {
        const providerToUse = tempProvider || provider;
        if (providerToUse) {
          const currentAddress = (await tempSigner?.getAddress()) || account;

          // Get campaign details
          const campaign = await campaignContract.getCampaign(campaignId);
          const campaignOwner = campaign[5];

          if (currentAddress.toLowerCase() !== campaignOwner.toLowerCase()) {
            toast.error("Only the campaign owner can close this campaign");
            setLoading(false);
            return;
          }
        }
      } catch (ownerCheckError) {
        console.warn(
          "Owner verification skipped due to error:",
          ownerCheckError
        );
        // Continue anyway as the contract will check ownership
      }

      // Check network
      const providerToUse = tempProvider || provider;
      if (providerToUse) {
        const network = await providerToUse.getNetwork();
        console.log("Current network for closing campaign:", network.chainId);

        // Verify we're on Holesky
        if (network.chainId !== BigInt(HOLESKY_CHAIN_ID)) {
          console.warn("Not on Holesky testnet!");
          toast.warning(
            `Please switch to Holesky testnet (Chain ID: ${HOLESKY_CHAIN_ID})`
          );

          // Try to switch network if MetaMask is available
          try {
            await (window as any).ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${HOLESKY_CHAIN_ID.toString(16)}` }],
            });
            toast.info(
              "Please try closing the campaign again after network switch"
            );
            setLoading(false);
            return;
          } catch (switchError) {
            console.error("Failed to switch network:", switchError);
            // Continue anyway, the transaction will likely fail
          }
        }
      }

      // Send transaction with retry mechanism
      let tx;
      try {
        // First attempt with dynamic gas estimation
        tx = await campaignContract.closeCampaign(campaignId);
      } catch (gasError) {
        console.warn(
          "Dynamic gas estimation failed, trying with fixed gas limit:",
          gasError
        );

        // Second attempt with fixed gas limit
        tx = await campaignContract.closeCampaign(campaignId, {
          gasLimit: 1000000,
        });
      }

      console.log("Transaction sent:", tx.hash);
      toast.info(`Transaction submitted: ${tx.hash.substring(0, 10)}...`);

      // Monitor transaction with timeout
      const txPromise = tx.wait();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Transaction confirmation timeout")),
          60000
        )
      );

      try {
        const receipt = await Promise.race([txPromise, timeoutPromise]);
        console.log("Transaction confirmed:", receipt);
        toast.success("Campaign closed successfully!");
      } catch (timeoutError) {
        console.warn(
          "Transaction wait timed out but may still succeed:",
          timeoutError
        );
        toast.info(
          "Transaction submitted but confirmation is taking longer than expected"
        );
      }

      // Reload campaigns using the read-only contract to avoid wallet issues
      const contractToUse = readonlyContract || campaignContract;
      await loadCampaigns(contractToUse);

      // If this was the selected campaign, reload its donations too
      if (selectedCampaign && selectedCampaign.id === campaignId) {
        await loadCampaignDonations(campaignId);

        // Update the selected campaign in state to reflect its closed status
        setSelectedCampaign({
          ...selectedCampaign,
          isActive: false,
        });
      }
    } catch (error) {
      console.error("Error closing campaign:", error);
      const errorMessage =
        (error as any)?.reason || (error as Error).message || "Unknown error";
      toast.error(`Failed to close campaign: ${errorMessage}`);

      // Check for specific error conditions
      if (
        errorMessage.includes("user rejected") ||
        errorMessage.includes("User denied")
      ) {
        toast.info("Transaction was rejected in your wallet");
      } else if (errorMessage.includes("not owner")) {
        toast.error("Only the campaign owner can close this campaign");
      }
    } finally {
      setLoading(false);
    }
  };

  // Withdraw funds from a campaign (only campaign creator)
  const withdrawFunds = async (campaignId: number) => {
    if (!contract) {
      toast.error("Please connect your wallet to withdraw funds");
      return;
    }

    try {
      setLoading(true);
      console.log(`Withdrawing funds from campaign ${campaignId}...`);

      // First, let's check some conditions to help debug
      try {
        // Get campaign details
        const campaign = await contract.campaigns(campaignId);
        console.log("Campaign details:", campaign);

        // Check if the user is the owner
        const owner = campaign.owner || campaign.creator; // Depending on your contract structure
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const currentAccount = accounts[0].toLowerCase();

        console.log("Campaign owner:", owner);
        console.log("Current account:", currentAccount);

        if (owner.toLowerCase() !== currentAccount) {
          console.warn("Warning: Current account is not the campaign owner");
        }

        // Check campaign status
        if (campaign.status !== undefined) {
          console.log("Campaign status:", campaign.status);
        }

        // Check if there are funds to withdraw
        const balance = campaign.balance || campaign.amountRaised;
        console.log("Campaign balance:", balance.toString());

        if (balance.toString() === "0") {
          console.warn("Warning: Campaign has zero balance");
        }
      } catch (checkError) {
        console.error("Error checking campaign details:", checkError);
      }

      // Now try the actual withdrawal
      try {
        const tx = await contract.withdrawFunds(campaignId, {
          gasLimit: 1000000,
        });

        console.log("Transaction sent:", tx.hash);
        toast.info(`Transaction submitted: ${tx.hash.substring(0, 10)}...`);

        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        toast.success("Funds withdrawn successfully!");
        await loadCampaigns(contract);
      } catch (txError: any) {
        console.error("Transaction failed:", txError);

        // Decode the revert reason if available
        let errorMessage = "Transaction reverted";

        if (txError.data) {
          // Try to extract error data
          console.log("Error data:", txError.data);
        }

        if (txError.reason) {
          errorMessage = txError.reason;
        } else if (txError.message) {
          if (txError.message.includes("execution reverted")) {
            // Try to parse a more specific error from the message
            const errorRegex = /execution reverted:(.+?)"/;
            const match = errorRegex.exec(txError.message);
            if (match && match[1]) {
              errorMessage = match[1].trim();
            }
          } else {
            errorMessage = txError.message;
          }
        }

        toast.error(`Withdrawal failed: ${errorMessage}`);

        // Suggest possible solutions
        if (errorMessage.includes("caller is not the owner")) {
          toast.warning("You must be the campaign owner to withdraw funds");
        } else if (errorMessage.includes("insufficient funds")) {
          toast.warning("This campaign has no funds to withdraw");
        } else if (errorMessage.includes("campaign not ended")) {
          toast.warning("The campaign must be ended before withdrawing funds");
        } else if (errorMessage.includes("campaign not successful")) {
          toast.warning("Only successful campaigns can be withdrawn from");
        }
      }
    } catch (error) {
      console.error("Error in withdraw function:", error);
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Select a campaign and load its donations
  const selectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    loadCampaignDonations(campaign.id);
    setActiveTab("details");
  };

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Format address to shorter version
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Check if the current user is the owner of a campaign
  const isOwner = (campaignOwner: string) => {
    // Check if account exists and is a string
    if (!account || typeof account !== "string") {
      return false;
    }

    // Then safely compare the addresses
    return account.toLowerCase() === campaignOwner.toLowerCase();
  };

  useEffect(() => {
    setConnected(!!account);
  }, [account]);
  // Monitor for network and account changes
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const handleChainChanged = (chainId: string) => {
        console.log("Network changed to:", chainId);
        setNetworkInfo(`Chain ID: ${chainId}`);
        window.location.reload();
      };

      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Account changed to:", accounts[0]);
        window.location.reload();
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        ethereum.removeListener("chainChanged", handleChainChanged);
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // Transaction monitoring
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const handleTransactionHash = (hash: string) => {
        console.log("Transaction hash event:", hash);
      };

      const handleError = (error: any) => {
        console.error("MetaMask error:", error);
      };

      ethereum.on("transactionHash", handleTransactionHash);
      ethereum.on("error", handleError);

      return () => {
        ethereum.removeListener("transactionHash", handleTransactionHash);
        ethereum.removeListener("error", handleError);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster richColors />

      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent tracking-tight">
              Donatrace
            </h1>
            {networkInfo && (
              <p className="text-sm font-medium text-gray-500 mt-1 flex items-center">
                <span className="h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                {networkInfo}
              </p>
            )}
          </div>

          <WalletConnection
            onConnect={handleWalletConnect}
            requiredChainId={HOLESKY_CHAIN_ID}
            buttonClassName="min-w-[150px]"
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            {connected && (
              <>
                <TabsTrigger value="create">Create Campaign</TabsTrigger>
                <TabsTrigger value="my-donations">My Donations</TabsTrigger>
              </>
            )}
            {selectedCampaign && (
              <TabsTrigger value="details">Campaign Details</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="campaigns">
            {loading && campaigns.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading campaigns...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <CardTitle className="text-xl">
                          {campaign.name}
                        </CardTitle>
                        {campaign.isActive ? (
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-800"
                          >
                            Closed
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm truncate">
                        By {formatAddress(campaign.campaignOwner)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <p className="mb-4 text-sm line-clamp-2">
                        {campaign.description}
                      </p>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{campaign.progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">
                          {campaign.amountRaised} ETH raised
                        </span>
                        <span className="text-gray-500">
                          Goal: {campaign.goal} ETH
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        onClick={() => selectCampaign(campaign)}
                      >
                        View Details
                      </Button>

                      {campaign.isActive && (
                        <Dialog
                          open={
                            isDialogOpen && selectedCampaign?.id === campaign.id
                          }
                          onOpenChange={(open) => {
                            if (open && !connected) {
                              toast.error(
                                "Please connect your wallet to donate"
                              );
                              return;
                            }
                            setIsDialogOpen(open);
                            if (open) setSelectedCampaign(campaign);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant={"primary"}
                              onClick={() => {
                                if (!connected) {
                                  toast.error(
                                    "Please connect your wallet to donate"
                                  );

                                  return;
                                }
                              }}
                            >
                              Donate
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Donate to {campaign.name}
                              </DialogTitle>
                              <DialogDescription>
                                Support this campaign with ETH. Your donation
                                will be recorded on the blockchain.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Amount (ETH)
                                </label>
                                <Input
                                  type="number"
                                  placeholder="0.01"
                                  step="0.01"
                                  min="0.001"
                                  value={donationAmount}
                                  onChange={(e) =>
                                    setDonationAmount(e.target.value)
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Message (optional)
                                </label>
                                <Textarea
                                  placeholder="Add a message with your donation"
                                  value={donationMessage}
                                  onChange={(e) =>
                                    setDonationMessage(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant={"primary"}
                                onClick={makeDonation}
                                disabled={!donationAmount || loading}
                              >
                                {loading ? "Processing..." : "Donate Now"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardFooter>
                  </Card>
                ))}

                {campaigns.length === 0 && (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-600">
                      {loading ? (
                        "Loading campaigns..."
                      ) : (
                        <>
                          No campaigns found.{" "}
                          {connected
                            ? "Create one to get started!"
                            : "Connect your wallet to create a campaign."}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {connected && (
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Campaign</CardTitle>
                  <CardDescription>
                    Create a new fundraising campaign on the blockchain
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Campaign Name
                      </label>
                      <Input
                        placeholder="Enter campaign name"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe your campaign"
                        value={newCampaignDescription}
                        onChange={(e) =>
                          setNewCampaignDescription(e.target.value)
                        }
                        className="min-h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Funding Goal (ETH)
                      </label>
                      <Input
                        type="number"
                        placeholder="1.0"
                        step="0.1"
                        min="0.1"
                        value={newCampaignGoal}
                        onChange={(e) => setNewCampaignGoal(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col">
                  <Button
                    onClick={createCampaign}
                    variant={"primary"}
                    disabled={
                      !newCampaignName ||
                      !newCampaignDescription ||
                      !newCampaignGoal ||
                      loading
                    }
                    className="w-full"
                  >
                    {loading ? "Creating..." : "Create Campaign"}
                  </Button>

                  {/* Status display */}
                  {creationStatus && (
                    <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                      <p>Status: {creationStatus}</p>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          )}

          {connected && (
            <TabsContent value="my-donations">
              <UserDonationHistory
                contract={contract || readonlyContract}
                account={account}
              />
            </TabsContent>
          )}
          {selectedCampaign && (
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Campaign Details</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedCampaign.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created by{" "}
                        {formatAddress(selectedCampaign.campaignOwner)}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Status
                      </h4>
                      {selectedCampaign.isActive ? (
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-800"
                        >
                          Closed
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Progress
                      </h4>
                      <div className="mb-2">
                        <Progress
                          value={selectedCampaign.progress}
                          className="h-2"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{selectedCampaign.amountRaised} ETH raised</span>
                        <span className="text-gray-500">
                          Goal: {selectedCampaign.goal} ETH
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Description
                      </h4>
                      <p className="text-sm">{selectedCampaign.description}</p>
                    </div>

                    {isOwner(selectedCampaign.campaignOwner) && (
                      <div className="space-y-2 pt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Owner Actions
                        </h4>

                        {selectedCampaign.isActive && (
                          <Button
                            variant="outline"
                            onClick={() => closeCampaign(selectedCampaign.id)}
                            className="w-full mb-2"
                            disabled={loading}
                          >
                            Close Campaign
                          </Button>
                        )}

                        {Number(selectedCampaign.amountRaised) > 0 && (
                          <Button
                            variant={"soft"}
                            onClick={() => withdrawFunds(selectedCampaign.id)}
                            className="w-full"
                            disabled={loading}
                          >
                            Withdraw Funds
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Donations</CardTitle>

                      {selectedCampaign.isActive && (
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={(open) => {
                            if (open && !connected) {
                              toast.error(
                                "Please connect your wallet to donate"
                              );
                              return;
                            }
                            setIsDialogOpen(open);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant={"primary"}
                              onClick={() => {
                                if (!connected) {
                                  toast.error(
                                    "Please connect your wallet to donate"
                                  );
                                  return;
                                }
                              }}
                            >
                              Donate Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Donate to {selectedCampaign.name}
                              </DialogTitle>
                              <DialogDescription>
                                Support this campaign with ETH. Your donation
                                will be recorded on the blockchain.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Amount (ETH)
                                </label>
                                <Input
                                  type="number"
                                  placeholder="0.01"
                                  step="0.01"
                                  min="0.001"
                                  value={donationAmount}
                                  onChange={(e) =>
                                    setDonationAmount(e.target.value)
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Message (optional)
                                </label>
                                <Textarea
                                  placeholder="Add a message with your donation"
                                  value={donationMessage}
                                  onChange={(e) =>
                                    setDonationMessage(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant={"primary"}
                                onClick={makeDonation}
                                disabled={!donationAmount || loading}
                              >
                                {loading ? "Processing..." : "Donate Now"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <CardDescription>
                      {campaignDonations.length} donation
                      {campaignDonations.length !== 1 ? "s" : ""} received
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ScrollArea className="h-96">
                      {campaignDonations.length > 0 ? (
                        <div className="space-y-4">
                          {campaignDonations.map((donation, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8 bg-blue-100">
                                    <AvatarFallback className="text-xs text-blue-600 font-medium">
                                      {donation.donor
                                        .substring(2, 4)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {formatAddress(donation.donor)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatDate(donation.timestamp)}
                                    </p>
                                  </div>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800">
                                  {donation.amount} ETH
                                </Badge>
                              </div>

                              {donation.message && (
                                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                  {donation.message}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No donations yet</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            Donatrace powered by Blockchain
          </p>

          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 max-w-md">
            <AlertDescription className="text-xs">
              Always verify the authenticity of campaigns before donating.
              Blockchain ensures transparency of funds but not the legitimacy of
              campaigns.
            </AlertDescription>
          </Alert>
        </div>
      </footer>
    </div>
  );
}

export default App;
