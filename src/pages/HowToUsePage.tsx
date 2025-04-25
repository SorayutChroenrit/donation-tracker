// src/pages/HowToUsePage.tsx
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Wallet,
  PlusCircle,
  Coins,
  BarChart,
  Shield,
  Rocket,
} from "lucide-react";

const HowToUsePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">How to Use Donatrace</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-6">
            Donatrace is a blockchain-based fundraising platform that ensures
            transparency and security for all donations. Here's how you can get
            started:
          </p>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-orange-600" />
                  Step 1: Connect Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  First, connect your MetaMask wallet to the Holesky testnet.
                  Make sure you have:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>MetaMask browser extension installed</li>
                  <li>Holesky testnet network added</li>
                  <li>Some test ETH for transactions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-orange-600" />
                  Step 2: Create a Campaign
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>To create a campaign:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>
                    Navigate to the{" "}
                    <Link
                      to="/create"
                      className="text-orange-600 hover:underline"
                    >
                      Create Campaign
                    </Link>{" "}
                    page
                  </li>
                  <li>Fill in your campaign details</li>
                  <li>Set a realistic funding goal in ETH</li>
                  <li>Submit the transaction to create your campaign</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-orange-600" />
                  Step 3: Make a Donation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>To donate to a campaign:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>
                    Browse{" "}
                    <Link
                      to="/campaigns"
                      className="text-orange-600 hover:underline"
                    >
                      Active Campaigns
                    </Link>
                  </li>
                  <li>Click on a campaign to view details</li>
                  <li>Click "Donate" and enter the amount</li>
                  <li>Optionally add a message</li>
                  <li>Confirm the transaction in MetaMask</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-orange-600" />
                  Step 4: Track Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Monitor your campaigns and donations:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>
                    View your donation history on the{" "}
                    <Link
                      to="/my-donations"
                      className="text-orange-600 hover:underline"
                    >
                      My Donations
                    </Link>{" "}
                    page
                  </li>
                  <li>Track campaign progress in real-time</li>
                  <li>Withdraw funds from your campaigns when ready</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                What is the Holesky testnet?
              </h3>
              <p className="text-gray-600">
                Holesky is an Ethereum test network where you can interact with
                smart contracts using test ETH without risking real money.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How do I get test ETH?</h3>
              <p className="text-gray-600">
                You can get test ETH from the Holesky faucet. Search for
                "Holesky faucet" and follow the instructions to receive test
                ETH.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Are donations refundable?</h3>
              <p className="text-gray-600">
                No, once a donation is made and confirmed on the blockchain, it
                cannot be reversed. Please donate responsibly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                How do campaign owners withdraw funds?
              </h3>
              <p className="text-gray-600">
                Campaign owners can withdraw funds by visiting their campaign
                page and clicking the "Withdraw Funds" button.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-semibold">Security Notes</h2>
          </div>

          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Never share your private keys or seed phrase</li>
            <li>Verify campaign authenticity before donating</li>
            <li>Transactions on the blockchain are permanent</li>
            <li>Always double-check wallet addresses</li>
          </ul>
        </section>

        <section className="text-center py-8">
          <div className="flex justify-center mb-4">
            <Rocket className="h-12 w-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Ready to Start?</h2>
          <p className="text-gray-600 mb-6">
            Join the transparent fundraising revolution today!
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/campaigns">
              <Button size="lg" variant="hero">
                Browse Campaigns
              </Button>
            </Link>
            <Link to="/create">
              <Button size="lg" variant="outline">
                Create Campaign
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToUsePage;
