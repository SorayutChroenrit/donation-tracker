import { useState, useEffect } from "react";
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
import { motion } from "framer-motion";

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { createCampaign, loading, connected } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [creationStatus, setCreationStatus] = useState("");
  const [animate, setAnimate] = useState(false);

  // Start animations after component mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } },
  };

  const formItemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2 + custom * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

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
      <motion.div
        initial="hidden"
        animate={animate ? "visible" : "hidden"}
        variants={fadeInUp}
        className="text-center py-12"
      >
        <motion.h2 variants={fadeIn} className="text-2xl font-bold mb-4">
          Connect Your Wallet
        </motion.h2>
        <motion.p
          variants={fadeIn}
          transition={{ delay: 0.2 }}
          className="text-gray-600"
        >
          Please connect your wallet to create a campaign.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.7 }}
        className="text-3xl font-bold mb-8"
      >
        Create New Campaign
      </motion.h1>

      <motion.div
        initial="hidden"
        animate={animate ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <motion.div variants={fadeIn}>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>
                  Create a new donation campaign on the blockchain
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <motion.div
                className="space-y-2"
                custom={0}
                variants={formItemAnimation}
              >
                <label className="text-sm font-medium">Campaign Name</label>
                <Input
                  placeholder="Enter campaign name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-orange-200"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                custom={1}
                variants={formItemAnimation}
              >
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your campaign"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32 transition-all duration-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                custom={2}
                variants={formItemAnimation}
              >
                <label className="text-sm font-medium">
                  Donation Goal (ETH)
                </label>
                <Input
                  type="number"
                  placeholder="1.0"
                  step="0.1"
                  min="0.1"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-orange-200"
                />
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="hero"
                    disabled={!name || !description || !goal || loading}
                    className="w-full transition-all"
                  >
                    {loading ? (
                      <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        Creating...
                      </motion.span>
                    ) : (
                      "Create Campaign"
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              {creationStatus && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 bg-gray-100 rounded text-sm w-full"
                >
                  <motion.p
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Status: {creationStatus}
                  </motion.p>
                </motion.div>
              )}
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateCampaignPage;
