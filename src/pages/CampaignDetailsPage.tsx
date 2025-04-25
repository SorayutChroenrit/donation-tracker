// src/pages/CampaignDetailPage.tsx
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

    try {
      await withdrawFunds(campaign.id);
      toast.success("Funds withdrawn successfully!");
    } catch (error) {
      toast.error("Failed to withdraw funds");
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
      <div className="text-center py-12">
        <p className="text-gray-600">Loading campaign details...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{campaign.name}</h3>
            <p className="text-sm text-gray-500">
              Created by {formatAddress(campaign.campaignOwner)}
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
            {campaign.isActive ? (
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                Closed
              </Badge>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Progress</h4>
            <div className="mb-2">
              <Progress value={campaign.progress} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span>{campaign.amountRaised} ETH raised</span>
              <span className="text-gray-500">Goal: {campaign.goal} ETH</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Description
            </h4>
            <p className="text-sm">{campaign.description}</p>
          </div>

          {isOwner && (
            <div className="space-y-2 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Owner Actions
              </h4>

              {campaign.isActive && (
                <Button
                  variant="outline"
                  onClick={handleCloseCampaign}
                  className="w-full mb-2"
                  disabled={loading}
                >
                  Close Campaign
                </Button>
              )}

              {Number(campaign.amountRaised) > 0 && (
                <Button
                  variant="outline"
                  onClick={handleWithdrawFunds}
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
                  <Button variant="hero">Donate Now</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Donate to {campaign.name}</DialogTitle>
                    <DialogDescription>
                      Support this campaign with ETH. Your donation will be
                      recorded on the blockchain.
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
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDonate}
                      disabled={!donationAmount || loading}
                    >
                      {loading ? "Processing..." : "Donate Now"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-96">
            {donations.length > 0 ? (
              <div className="space-y-4">
                {donations.map((donation, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 bg-blue-100">
                          <AvatarFallback className="text-xs text-blue-600 font-medium">
                            {donation.donor.substring(2, 4).toUpperCase()}
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
  );
};

export default CampaignDetailPage;
