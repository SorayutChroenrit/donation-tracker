import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { ChevronsUpDown, Wallet, LogOut, Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

// Holesky Testnet Configuration
const HOLESKY_CHAIN_ID = 17000;
const HOLESKY_RPC_URL = "https://ethereum-holesky.publicnode.com";

// Define wallet provider types with their configuration details
type WalletProvider = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  connector: () => Promise<ethers.BrowserProvider>;
};

// Updated Account type to include balance
type Account = {
  address: string;
  balance: string;
  name?: string;
};

// Define the wallet connection state
type WalletConnectionState = {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  accounts: Account[];
  selectedAccount: Account | null;
  chainId: number | null;
  connected: boolean;
  loading: boolean;
};

// Define the wallet providers
const walletProviders: WalletProvider[] = [
  {
    id: "metamask",
    name: "MetaMask",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png",
    description: "Connect to your MetaMask Wallet",
    connector: async () => {
      if (!(window as any).ethereum?.isMetaMask) {
        throw new Error("MetaMask is not installed");
      }

      await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      return new ethers.BrowserProvider((window as any).ethereum);
    },
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF6hcTTU1A8Ymi2VldXqCsPkBu_ltAhIKiRg&s",
    description: "Connect to your Coinbase Wallet",
    connector: async () => {
      if (!(window as any).coinbaseWalletExtension) {
        throw new Error("Coinbase Wallet is not installed");
      }

      await (window as any).coinbaseWalletExtension.request({
        method: "eth_requestAccounts",
      });

      return new ethers.BrowserProvider(
        (window as any).coinbaseWalletExtension
      );
    },
  },
];

// Initial wallet connection state
const initialState: WalletConnectionState = {
  provider: null,
  signer: null,
  accounts: [],
  selectedAccount: null,
  chainId: null,
  connected: false,
  loading: false,
};

interface WalletConnectionProps {
  onConnect: (state: WalletConnectionState) => void;
  onDisconnect?: () => void;
  buttonClassName?: string;
  requiredChainId?: number;
}

export function WalletConnection({
  onConnect,
  onDisconnect,
  buttonClassName = "",
  requiredChainId = HOLESKY_CHAIN_ID,
}: WalletConnectionProps) {
  const [walletState, setWalletState] =
    useState<WalletConnectionState>(initialState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  // Format ETH balance for display
  const formatBalance = (balance: string) => {
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance)) return "0.0000";
    return numBalance.toFixed(4);
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Optimized balance fetching
  const fetchAccountBalance = async (
    provider: ethers.BrowserProvider,
    address: string
  ): Promise<string> => {
    try {
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      return "0";
    }
  };

  // Function to auto-load all account balances
  const loadAllBalances = async () => {
    if (!walletState.provider || walletState.accounts.length === 0) return;

    // Load balances for all accounts
    for (let i = 0; i < walletState.accounts.length; i++) {
      const account = walletState.accounts[i];
      if (
        account.balance === "Click to load" ||
        account.balance === "0" ||
        account.balance === "Load balance"
      ) {
        try {
          const balance = await fetchAccountBalance(
            walletState.provider,
            account.address
          );

          setWalletState((prev) => {
            const updatedAccounts = [...prev.accounts];
            updatedAccounts[i] = { ...updatedAccounts[i], balance };

            // Update selected account if needed
            const updatedSelectedAccount =
              prev.selectedAccount?.address === account.address
                ? { ...prev.selectedAccount, balance }
                : prev.selectedAccount;

            return {
              ...prev,
              accounts: updatedAccounts,
              selectedAccount: updatedSelectedAccount,
            };
          });
        } catch (error) {
          // Silent error handling
        }
      }
    }
  };

  // Set up event listeners for wallet changes
  const setupEventListeners = useCallback(
    (provider: ethers.BrowserProvider) => {
      const ethereum = (window as any).ethereum;

      if (ethereum) {
        // Handle account changes
        ethereum.on("accountsChanged", async (accounts: string[]) => {
          if (accounts.length === 0) {
            // User disconnected their wallet
            disconnectWallet();
          } else {
            try {
              // Only update the active account balance
              const balance = await fetchAccountBalance(provider, accounts[0]);

              const updatedAccount = {
                address: accounts[0],
                balance,
                name: `Account 1`,
              };

              setWalletState((prev) => {
                // Create new accounts array with updated first account
                const updatedAccounts = accounts.map((address, index) => {
                  if (index === 0) return updatedAccount;

                  // Find existing account or create new one
                  const existingAccount = prev.accounts.find(
                    (a) => a.address === address
                  );
                  return (
                    existingAccount || {
                      address,
                      balance: "0",
                      name: `Account ${index + 1}`,
                    }
                  );
                });

                const newState = {
                  ...prev,
                  accounts: updatedAccounts,
                  selectedAccount: updatedAccount,
                };

                onConnect(newState);
                return newState;
              });

              toast.info("Account changed", {
                description: `Now using: ${formatAddress(accounts[0])}`,
              });
            } catch (error) {
              // Handle error silently
            }
          }
        });

        // Handle chain changes
        ethereum.on("chainChanged", async (chainIdHex: string) => {
          const chainId = parseInt(chainIdHex, 16);

          // Only create new provider when chain changes
          const newProvider = new ethers.BrowserProvider(ethereum);

          try {
            // Get current signer without unnecessary fetches
            const newSigner = await newProvider.getSigner();

            setWalletState((prev) => {
              const newState = {
                ...prev,
                provider: newProvider,
                signer: newSigner,
                chainId,
              };

              onConnect(newState);
              return newState;
            });

            toast.info("Network changed", {
              description: `Connected to chain ID: ${chainId}`,
            });
          } catch (error) {
            // Handle error silently
          }
        });

        // Handle disconnect
        ethereum.on("disconnect", () => {
          disconnectWallet();
        });
      }
    },
    [onConnect]
  );

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    // Remove event listeners
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      ethereum.removeAllListeners("accountsChanged");
      ethereum.removeAllListeners("chainChanged");
      ethereum.removeAllListeners("disconnect");
    }

    // Reset state
    setWalletState(initialState);

    // Call onDisconnect callback if provided
    if (onDisconnect) {
      onDisconnect();
    }

    toast.success("Wallet disconnected");
  }, [onDisconnect]);

  // Function to add Holesky network to MetaMask
  const addHoleskyNetwork = async () => {
    try {
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${HOLESKY_CHAIN_ID.toString(16)}`,
            chainName: "Holesky Testnet",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: [HOLESKY_RPC_URL],
            blockExplorerUrls: ["https://holesky.etherscan.io"],
          },
        ],
      });
    } catch (error) {
      toast.error("Failed to add Holesky network", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // Function to connect to a wallet provider with multiple accounts
  const connectWallet = async (provider: WalletProvider) => {
    try {
      setIsConnecting(provider.id);
      setWalletState((prev) => ({ ...prev, loading: true }));

      // Connect to the provider
      const ethProvider = await provider.connector();

      // Get signer first to ensure we have wallet access
      const signer = await ethProvider.getSigner();

      // For MetaMask, use the ethereum object to get all accounts
      let allAccounts: string[] = [];

      if ((window as any).ethereum) {
        try {
          // This gets all accounts from MetaMask
          allAccounts = await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });
        } catch (error) {
          // Fallback to provider's listAccounts if direct method fails
          const accountsResponse = await ethProvider.listAccounts();
          allAccounts = accountsResponse.map((account) => account.address);
        }
      } else {
        // Fallback for non-MetaMask wallets
        const accountsResponse = await ethProvider.listAccounts();
        allAccounts = accountsResponse.map((account) => account.address);
      }

      if (allAccounts.length === 0) {
        throw new Error("No accounts available");
      }

      // Check network information
      let chainId: number;
      try {
        const network = await ethProvider.getNetwork();
        chainId = Number(network.chainId);

        // Check if network switching is needed
        if (requiredChainId && chainId !== requiredChainId) {
          // Don't await this - it will be handled by the chainChanged event
          (window as any).ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${requiredChainId.toString(16)}` }],
            })
            .catch((switchError: any) => {
              if (switchError.code === 4902) {
                // Network not found, offer to add it
                addHoleskyNetwork();
              }
            });
        }
      } catch (error) {
        chainId = 0; // Default value
      }

      // Create account objects
      const accountsWithNames: Account[] = [];

      // For each account address, create an account object
      for (let i = 0; i < allAccounts.length; i++) {
        const address = allAccounts[i];
        let name = `Account ${i + 1}`;

        // Try to get the account name from MetaMask
        if ((window as any).ethereum) {
          try {
            const accountInfo = await (window as any).ethereum.request({
              method: "wallet_getPermissions",
            });

            // Look for account name in permissions if available
            if (accountInfo && accountInfo[0] && accountInfo[0].accounts) {
              for (const acc of accountInfo[0].accounts) {
                if (
                  acc.address &&
                  acc.address.toLowerCase() === address.toLowerCase() &&
                  acc.label
                ) {
                  name = acc.label;
                  break;
                }
              }
            }
          } catch (e) {
            // If getting account name fails, use the default
          }
        }

        accountsWithNames.push({
          address,
          balance: "Click to load",
          name,
        });
      }

      // Final state update without waiting for balance data
      const newState = {
        provider: ethProvider,
        signer,
        accounts: accountsWithNames,
        selectedAccount: accountsWithNames[0],
        chainId,
        connected: true,
        loading: false,
      };

      setWalletState(newState);
      onConnect(newState);
      setIsDialogOpen(false);

      toast.success(`Connected to ${provider.name}`, {
        description: `${accountsWithNames.length} accounts available`,
      });

      // Set up event listeners after everything is done
      setupEventListeners(ethProvider);

      // Immediately load actual balances for all accounts
      accountsWithNames.forEach(async (account, index) => {
        try {
          const balance = await fetchAccountBalance(
            ethProvider,
            account.address
          );

          setWalletState((prev) => {
            if (!prev.connected) return prev;

            const updatedAccounts = [...prev.accounts];
            updatedAccounts[index] = { ...updatedAccounts[index], balance };

            // If this is the selected account, update it too
            const updatedSelectedAccount =
              prev.selectedAccount?.address === account.address
                ? { ...prev.selectedAccount, balance }
                : prev.selectedAccount;

            return {
              ...prev,
              accounts: updatedAccounts,
              selectedAccount: updatedSelectedAccount,
            };
          });
        } catch (error) {
          // Silent error handling
        }
      });
    } catch (error) {
      toast.error(`Failed to connect to ${provider.name}`, {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      setWalletState(initialState);
    } finally {
      setIsConnecting(null);
      setWalletState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Load balance for selected account when user switches
  const handleAccountSelect = async (account: Account) => {
    if (!walletState.provider) return;

    // Only fetch balance if it's not loaded yet
    if (account.balance === "0" && walletState.provider) {
      try {
        const balance = await fetchAccountBalance(
          walletState.provider,
          account.address
        );

        setWalletState((prev) => {
          // Update the account in the accounts array
          const updatedAccounts = prev.accounts.map((a) =>
            a.address === account.address ? { ...a, balance } : a
          );

          const updatedAccount = { ...account, balance };

          // Calculate new total balance

          const newState = {
            ...prev,
            accounts: updatedAccounts,
            selectedAccount: updatedAccount,
          };

          onConnect(newState);
          return newState;
        });
      } catch (error) {
        // Silent error handling
      }
    } else {
      // If balance is already loaded, just update selected account
      setWalletState((prev) => {
        const newState = {
          ...prev,
          selectedAccount: account,
        };

        onConnect(newState);
        return newState;
      });
    }
  };

  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        ethereum.removeAllListeners("accountsChanged");
        ethereum.removeAllListeners("chainChanged");
        ethereum.removeAllListeners("disconnect");
      }
    };
  }, []);

  // Auto-load balances when dropdown opens
  useEffect(() => {
    if (walletState.connected) {
      loadAllBalances();
    }
  }, [walletState.connected]);

  return (
    <>
      {!walletState.connected ? (
        <Button
          variant={"gradient"}
          onClick={() => setIsDialogOpen(true)}
          disabled={walletState.loading}
          className={buttonClassName}
        >
          {walletState.loading ? (
            "Connecting..."
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          {/* Account Selection Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 sm:gap-2"
              >
                <span className="hidden sm:flex items-center gap-2">
                  {formatAddress(walletState.selectedAccount?.address || "")}
                  <Badge variant="secondary" className="ml-2">
                    {formatBalance(walletState.selectedAccount?.balance || "0")}{" "}
                    ETH
                  </Badge>
                </span>
                <span className="flex sm:hidden items-center gap-1">
                  {formatAddress(
                    walletState.selectedAccount?.address || ""
                  ).substring(0, 6)}
                  ...
                  <Badge variant="secondary" className="ml-1">
                    {formatBalance(
                      walletState.selectedAccount?.balance || "0"
                    ).substring(0, 4)}
                  </Badge>
                </span>
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-2 py-1.5 text-sm font-medium text-gray-500">
                Your Accounts
              </div>
              {walletState.accounts.map((account) => (
                <DropdownMenuItem
                  key={account.address}
                  onClick={() => handleAccountSelect(account)}
                  className={`flex items-center justify-between ${
                    walletState.selectedAccount?.address === account.address
                      ? "bg-slate-100"
                      : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatAddress(account.address)}
                    </span>

                    <span className="text-xs text-gray-500">
                      {formatBalance(account.balance)} ETH
                    </span>
                  </div>
                  {walletState.selectedAccount?.address === account.address && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </DropdownMenuItem>
              ))}
              <div className="h-px my-1 bg-gray-200" />
              <DropdownMenuItem
                onClick={disconnectWallet}
                className="text-red-500 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Select a wallet provider to connect to this application
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {walletProviders.map((provider) => (
              <Card
                key={provider.id}
                className={`cursor-pointer hover:border-blue-500 transition-all ${
                  isConnecting === provider.id
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : ""
                }`}
                onClick={() => connectWallet(provider)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-slate-100 p-2 rounded-md flex items-center justify-center w-12 h-12">
                    <img
                      src={provider.imageUrl}
                      alt={`${provider.name} logo`}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{provider.name}</h3>
                    <p className="text-sm text-gray-500">
                      {provider.description}
                    </p>
                  </div>
                  {isConnecting === provider.id && (
                    <div className="flex items-center">
                      <Skeleton className="h-5 w-5 rounded-full animate-spin border-2 border-blue-500 border-t-transparent" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WalletConnection;
