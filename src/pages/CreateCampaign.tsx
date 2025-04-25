// src/pages/CreateCampaignPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { createCampaign, loading, connected } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [creationStatus, setCreationStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected) {
      toast.error("Please connect your wallet to create a campaign");
      return;
    }

    try {
      setCreationStatus("Creating campaign...");
      await createCampaign(name, description, goal);
      toast.success("Campaign created successfully!");
      navigate("/campaigns");
    } catch (error) {
      toast.error("Failed to create campaign");
      setCreationStatus("");
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Please connect your wallet to create a campaign.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Campaign</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Create a new fundraising campaign on the blockchain
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Name</label>
              <Input
                placeholder="Enter campaign name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your campaign"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Funding Goal (ETH)</label>
              <Input
                type="number"
                placeholder="1.0"
                step="0.1"
                min="0.1"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button
              type="submit"
              variant="hero"
              disabled={!name || !description || !goal || loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Campaign"}
            </Button>

            {creationStatus && (
              <div className="p-3 bg-gray-100 rounded text-sm w-full">
                <p>Status: {creationStatus}</p>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateCampaignPage;
