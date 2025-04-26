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
import { motion } from "framer-motion";
import { ReactElement } from "react";

interface StepCard {
  icon: ReactElement;
  title: string;
  content: ReactElement;
}

const HowToUsePage = () => {
  // Step cards data
  const stepCards: StepCard[] = [
    {
      icon: <Wallet className="h-5 w-5 text-orange-600" />,
      title: "Step 1: Connect Your Wallet",
      content: (
        <>
          <p>
            First, connect your MetaMask wallet to the Holesky testnet. Make
            sure you have:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>MetaMask browser extension installed</li>
            <li>Holesky testnet network added</li>
            <li>Some test ETH for transactions</li>
          </ul>
        </>
      ),
    },
    {
      icon: <PlusCircle className="h-5 w-5 text-orange-600" />,
      title: "Step 2: Create a Campaign",
      content: (
        <>
          <p>To create a campaign:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              Navigate to the{" "}
              <Link to="/create" className="text-orange-600 hover:underline">
                Create Campaign
              </Link>{" "}
              page
            </li>
            <li>Fill in your campaign details</li>
            <li>Set a realistic funding goal in ETH</li>
            <li>Submit the transaction to create your campaign</li>
          </ul>
        </>
      ),
    },
    {
      icon: <Coins className="h-5 w-5 text-orange-600" />,
      title: "Step 3: Make a Donation",
      content: (
        <>
          <p>To donate to a campaign:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              Browse{" "}
              <Link to="/campaigns" className="text-orange-600 hover:underline">
                Active Campaigns
              </Link>
            </li>
            <li>Click on a campaign to view details</li>
            <li>Click "Donate" and enter the amount</li>
            <li>Optionally add a message</li>
            <li>Confirm the transaction in MetaMask</li>
          </ul>
        </>
      ),
    },
    {
      icon: <BarChart className="h-5 w-5 text-orange-600" />,
      title: "Step 4: Track Your Activity",
      content: (
        <>
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
        </>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-3xl font-bold mb-8"
      >
        How to Use Donatrace
      </motion.h1>

      <div className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-6">
            Donatrace is a blockchain-based fundraising platform that ensures
            transparency and security for all donations. Here's how you can get
            started:
          </p>

          <div className="grid gap-6">
            {stepCards.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.4 + i * 0.1,
                          duration: 0.3,
                          type: "spring",
                        }}
                      >
                        {step.icon}
                      </motion.div>
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{step.content}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="font-semibold mb-2">
                What is the Holesky testnet?
              </h3>
              <p className="text-gray-600">
                Holesky is an Ethereum test network where you can interact with
                smart contracts using test ETH without risking real money.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="font-semibold mb-2">How do I get test ETH?</h3>
              <p className="text-gray-600">
                You can get test ETH from the Holesky faucet. Search for
                "Holesky faucet" and follow the instructions to receive test
                ETH.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <h3 className="font-semibold mb-2">Are donations refundable?</h3>
              <p className="text-gray-600">
                No, once a donation is made and confirmed on the blockchain, it
                cannot be reversed. Please donate responsibly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <h3 className="font-semibold mb-2">
                How do campaign owners withdraw funds?
              </h3>
              <p className="text-gray-600">
                Campaign owners can withdraw funds by visiting their campaign
                page and clicking the "Withdraw Funds" button.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="bg-orange-50 p-6 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              <Shield className="h-6 w-6 text-orange-600" />
            </motion.div>
            <h2 className="text-2xl font-semibold">Security Notes</h2>
          </div>

          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.3 }}
            >
              Never share your private keys or seed phrase
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.3 }}
            >
              Verify campaign authenticity before donating
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.3 }}
            >
              Transactions on the blockchain are permanent
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.3 }}
            >
              Always double-check wallet addresses
            </motion.li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.7 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.8, duration: 0.4 }}
            className="flex justify-center mb-4"
          >
            <Rocket className="h-12 w-12 text-orange-600" />
          </motion.div>

          <h2 className="text-2xl font-semibold mb-4">Ready to Start?</h2>
          <p className="text-gray-600 mb-6">
            Join the transparent fundraising revolution today!
          </p>

          <div className="flex justify-center gap-4">
            <Link to="/campaigns">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="hero" className="transition-all">
                  Browse Campaigns
                </Button>
              </motion.div>
            </Link>
            <Link to="/create">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="transition-all">
                  Create Campaign
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HowToUsePage;
