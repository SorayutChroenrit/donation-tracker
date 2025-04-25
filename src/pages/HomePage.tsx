// src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useApp } from "../context/AppContext";

const HomePage = () => {
  const { campaigns, connected } = useApp();

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.isActive).length,
    totalRaised: campaigns.reduce(
      (acc, c) => acc + parseFloat(c.amountRaised),
      0
    ),
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Transparent Fundraising with Blockchain
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create and support campaigns with complete transparency. Every
          donation is recorded on the blockchain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/campaigns">
            <Button variant="hero" size="lg" className="w-full sm:w-auto">
              View Campaigns
            </Button>
          </Link>
          {connected ? (
            <Link to="/create">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Create Campaign
              </Button>
            </Link>
          ) : (
            <Link to="/how-to-use">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn How It Works
              </Button>
            </Link>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center text-orange-600">
              {stats.totalCampaigns}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center text-green-600">
              {stats.activeCampaigns}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Total Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center text-blue-600">
              {stats.totalRaised.toFixed(4)} ETH
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-orange-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-600">1</span>
            </div>
            <h3 className="font-semibold mb-2">Connect Wallet</h3>
            <p className="text-gray-600">
              Connect your MetaMask wallet to start creating or supporting
              campaigns
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-orange-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-600">2</span>
            </div>
            <h3 className="font-semibold mb-2">Create or Donate</h3>
            <p className="text-gray-600">
              Create a new campaign or support existing ones with ETH donations
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-orange-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-600">3</span>
            </div>
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor campaign progress and donations on the blockchain
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
