import { useState, useEffect } from "react";
import { ethers } from "ethers";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";

// Define interface for the contract
interface DonationContract {
  getAllUserDonations: (address: string) => Promise<
    [
      bigint[], // campaignIds
      bigint[], // amounts
      bigint[], // timestamps
      string[] // campaignNames
    ]
  >;
}

// Define interface for formatted donation
interface FormattedDonation {
  campaignId: number;
  campaignName: string;
  amount: string;
  timestamp: number;
}

// Define props interface
interface UserDonationHistoryProps {
  contract: DonationContract | null;
  account: string;
}

// User Donation History component
const UserDonationHistory: React.FC<UserDonationHistoryProps> = ({
  contract,
  account,
}) => {
  const [donations, setDonations] = useState<FormattedDonation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Format date from timestamp
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Load user donation history
  useEffect(() => {
    const loadUserDonations = async (): Promise<void> => {
      if (!contract || !account) return;

      try {
        setLoading(true);
        console.log("Loading donation history for account:", account);

        // Call the getAllUserDonations function
        const [campaignIds, amounts, timestamps, campaignNames] =
          await contract.getAllUserDonations(account);

        console.log("User donation data retrieved:", {
          campaignIds,
          amounts,
          timestamps,
          campaignNames,
        });

        // Format the donations
        const formattedDonations: FormattedDonation[] = [];
        for (let i = 0; i < campaignIds.length; i++) {
          formattedDonations.push({
            campaignId: Number(campaignIds[i]),
            campaignName: campaignNames[i],
            amount: ethers.formatEther(amounts[i]),
            timestamp: Number(timestamps[i]),
          });
        }

        // Sort by timestamp (newest first)
        formattedDonations.sort((a, b) => b.timestamp - a.timestamp);

        setDonations(formattedDonations);
      } catch (error) {
        console.error("Error loading user donations:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to load donation history: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadUserDonations();
  }, [contract, account]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Donation History</CardTitle>
        <CardDescription>
          {donations.length} donation{donations.length !== 1 ? "s" : ""} made
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : donations.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {donations.map((donation, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 bg-blue-100">
                        <div className="text-xs text-blue-600 font-medium">
                          {donation.campaignId}
                        </div>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {donation.campaignName}
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
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">You haven't made any donations yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDonationHistory;
