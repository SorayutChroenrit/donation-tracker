import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { Donation } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    campaigns,
    account,
    loading,
    connected,
    makeDonation,
    closeCampaign,
    withdrawFunds,
    getCampaignDonations,
  } = useApp();
  const [campaign, setCampaign] = useState<any | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");

  // Animation refs for different sections
  const [detailsRef, detailsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [donationsRef, donationsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (id && campaigns.length > 0) {
      const foundCampaign = campaigns.find((c) => c.id === parseInt(id));
      setCampaign(foundCampaign);

      if (foundCampaign) {
        loadDonations(foundCampaign.id);
      }
    }
  }, [id, campaigns]);

  const loadDonations = async (campaignId: number) => {
    try {
      const donationsData = await getCampaignDonations(campaignId);
      setDonations(donationsData);
    } catch (error) {
      console.error("Error loading donations:", error);
      toast.error("Failed to load donations");
    }
  };

  const handleDonate = async () => {
    if (!campaign) return;

    try {
      await makeDonation(campaign.id, donationAmount, donationMessage);
      setIsDialogOpen(false);
      setDonationAmount("");
      setDonationMessage("");
      toast.success("Donation successful!");
      loadDonations(campaign.id);
    } catch (error) {
      toast.error("Failed to make donation");
    }
  };

  const handleCloseCampaign = async () => {
    if (!campaign) return;

    try {
      await closeCampaign(campaign.id);
      toast.success("Campaign closed successfully!");
      // Refresh campaign data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to close campaign");
    }
  };

  const handleWithdrawFunds = async () => {
    if (!campaign) return;

    if (campaign.isActive) {
      toast.error("Please close the campaign before withdrawing funds");
      return;
    }

    if (Number(campaign.amountRaised) <= 0) {
      toast.error("No funds available to withdraw");
      return;
    }

    try {
      await withdrawFunds(campaign.id);
      toast.success("Funds withdrawn successfully!");
      // Refresh campaign data
      window.location.reload();
    } catch (error: any) {
      console.error("Error withdrawing funds:", error);

      // Provide more specific error messages
      if (error.message.includes("Campaign must be closed")) {
        toast.error("You must close the campaign before withdrawing funds");
      } else if (error.message.includes("Only campaign owner")) {
        toast.error("Only the campaign owner can withdraw funds");
      } else if (error.message.includes("No funds to withdraw")) {
        toast.error("No funds available to withdraw");
      } else {
        toast.error(
          `Failed to withdraw funds: ${error.message || "Unknown error"}`
        );
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const isOwner =
    campaign && account.toLowerCase() === campaign.campaignOwner.toLowerCase();

  if (!campaign) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.4, 1, 0.4],
          transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          },
        }}
        className="text-center py-12"
      >
        <p className="text-gray-600">Loading campaign details...</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        ref={detailsRef}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: detailsInView ? 1 : 0, x: detailsInView ? 0 : -30 }}
        transition={{ duration: 0.7 }}
        className="md:col-span-1"
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: detailsInView ? 1 : 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="font-semibold text-lg">{campaign.name}</h3>
              <p className="text-sm text-gray-500">
                Created by {formatAddress(campaign.campaignOwner)}
              </p>
            </motion.div>

            <Separator />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: detailsInView ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
              {campaign.isActive ? (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-800"
                >
                  Closed
                </Badge>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: detailsInView ? 1 : 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Progress
              </h4>
              <div className="mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                >
                  <Progress value={campaign.progress} className="h-2" />
                </motion.div>
              </div>
              <div className="flex justify-between text-sm">
                <span>{campaign.amountRaised} ETH donated</span>
                <span className="text-gray-500">Goal: {campaign.goal} ETH</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: detailsInView ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Description
              </h4>
              <p className="text-sm">{campaign.description}</p>
            </motion.div>

            {isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: detailsInView ? 1 : 0,
                  y: detailsInView ? 0 : 20,
                }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-2 pt-4"
              >
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Owner Actions
                </h4>

                {campaign.isActive && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleCloseCampaign}
                      className="w-full mb-2 transition-all"
                      disabled={loading}
                    >
                      Close Campaign
                    </Button>
                  </motion.div>
                )}

                {/* Only show withdraw button if campaign is closed AND has funds */}
                {!campaign.isActive && Number(campaign.amountRaised) > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleWithdrawFunds}
                      className="w-full transition-all"
                      disabled={loading}
                    >
                      Withdraw Funds
                    </Button>
                  </motion.div>
                )}

                {/* Show helpful message if campaign needs to be closed before withdrawing */}
                {campaign.isActive && Number(campaign.amountRaised) > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded"
                  >
                    Please close the campaign before withdrawing funds
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        ref={donationsRef}
        initial={{ opacity: 0, x: 30 }}
        animate={{
          opacity: donationsInView ? 1 : 0,
          x: donationsInView ? 0 : 30,
        }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="md:col-span-2"
      >
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Donations</CardTitle>

              {campaign.isActive && (
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={(open) => {
                    if (open && !connected) {
                      toast.error("Please connect your wallet to donate");
                      return;
                    }
                    setIsDialogOpen(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="hero" className="transition-all">
                        Donate Now
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DialogHeader>
                        <DialogTitle>Donate to {campaign.name}</DialogTitle>
                        <DialogDescription>
                          Support this campaign with ETH. Your donation will be
                          recorded on the blockchain.
                        </DialogDescription>
                      </DialogHeader>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="space-y-4 py-4"
                      >
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
                            onChange={(e) => setDonationAmount(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Message (optional)
                          </label>
                          <Textarea
                            placeholder="Add a message with your donation"
                            value={donationMessage}
                            onChange={(e) => setDonationMessage(e.target.value)}
                          />
                        </div>
                      </motion.div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={handleDonate}
                            disabled={!donationAmount || loading}
                          >
                            {loading ? "Processing..." : "Donate Now"}
                          </Button>
                        </motion.div>
                      </DialogFooter>
                    </motion.div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-96">
              <AnimatePresence>
                {donations.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: donationsInView ? 1 : 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-4"
                  >
                    {donations.map((donation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.3 + index * 0.1,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              <Avatar className="h-8 w-8 bg-blue-100">
                                <AvatarFallback className="text-xs text-blue-600 font-medium">
                                  {donation.donor.substring(2, 4).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                            <div>
                              <p className="text-sm font-medium">
                                {formatAddress(donation.donor)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(donation.timestamp)}
                              </p>
                            </div>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.4 + index * 0.1,
                              duration: 0.5,
                            }}
                          >
                            <Badge className="bg-blue-100 text-blue-800">
                              {donation.amount} ETH
                            </Badge>
                          </motion.div>
                        </div>

                        {donation.message && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{
                              delay: 0.5 + index * 0.1,
                              duration: 0.5,
                            }}
                            className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded"
                          >
                            {donation.message}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <p className="text-gray-500">No donations yet</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CampaignDetailPage;
