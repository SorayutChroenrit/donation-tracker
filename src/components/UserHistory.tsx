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
import { motion, AnimatePresence } from "framer-motion";

// Define interface for formatted donation
interface FormattedDonation {
  campaignId: number;
  campaignName: string;
  amount: string;
  timestamp: number;
}

// Define props interface - use ethers.Contract as the type
interface UserDonationHistoryProps {
  contract: ethers.Contract | null;
  account: string;
}

// User Donation History component
const UserDonationHistory: React.FC<UserDonationHistoryProps> = ({
  contract,
  account,
}) => {
  const [donations, setDonations] = useState<FormattedDonation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);

  // Animation variants
  const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  // Start animations after data loads
  useEffect(() => {
    if (!loading && donations.length > 0) {
      setAnimate(true);
    }
  }, [loading, donations]);

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
    <motion.div initial="hidden" animate="visible" variants={cardAnimation}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle>Your Donation History</CardTitle>
          <CardDescription>
            {donations.length} donation{donations.length !== 1 ? "s" : ""} made
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            // Loading state with animated skeletons
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    x: 0,
                  }}
                  transition={{
                    opacity: {
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.2,
                    },
                    x: { duration: 0.3 },
                  }}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </motion.div>
              ))}
            </div>
          ) : donations.length > 0 ? (
            <ScrollArea className="h-96">
              <AnimatePresence>
                <motion.div
                  initial="hidden"
                  animate={animate ? "visible" : "hidden"}
                  className="space-y-4"
                >
                  {donations.map((donation, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={itemAnimation}
                      whileHover={{
                        y: -3,
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                      className="p-4 border rounded-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.2 + index * 0.05,
                              type: "spring",
                              stiffness: 200,
                            }}
                          >
                            <Avatar className="h-10 w-10 bg-blue-100">
                              <div className="text-xs text-blue-600 font-medium">
                                {donation.campaignId}
                              </div>
                            </Avatar>
                          </motion.div>
                          <div>
                            <p className="text-sm font-medium">
                              {donation.campaignName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(donation.timestamp)}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.3 + index * 0.05,
                            duration: 0.4,
                          }}
                        >
                          <Badge className="bg-blue-100 text-blue-800">
                            {donation.amount} ETH
                          </Badge>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center py-8"
            >
              <p className="text-gray-500">
                You haven't made any donations yet
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserDonationHistory;
