import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

const ActiveCampaignsPage = () => {
  const { campaigns, loading, connected, makeDonation } = useApp();
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");

  const handleDonate = async () => {
    if (selectedCampaign === null) return;

    try {
      await makeDonation(selectedCampaign, donationAmount, donationMessage);
      setIsDialogOpen(false);
      setDonationAmount("");
      setDonationMessage("");
      toast.success("Donation successful!");
    } catch (error) {
      toast.error("Failed to make donation");
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Active Campaigns</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-1">
                <CardTitle className="text-xl">{campaign.name}</CardTitle>
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
                <span className="text-gray-500">Goal: {campaign.goal} ETH</span>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
              <Link to={`/campaign/${campaign.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>

              {campaign.isActive && (
                <Dialog
                  open={isDialogOpen && selectedCampaign === campaign.id}
                  onOpenChange={(open) => {
                    if (open && !connected) {
                      toast.error("Please connect your wallet to donate");
                      return;
                    }
                    setIsDialogOpen(open);
                    if (open) setSelectedCampaign(campaign.id);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="hero">Donate</Button>
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
                        variant="hero"
                        onClick={handleDonate}
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
              No campaigns found.{" "}
              {connected ? (
                <Link to="/create" className="text-orange-600 hover:underline">
                  Create one to get started!
                </Link>
              ) : (
                "Connect your wallet to create a campaign."
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCampaignsPage;
