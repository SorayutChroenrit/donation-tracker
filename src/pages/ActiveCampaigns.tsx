import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ActiveCampaignsPage = () => {
  const { campaigns, loading, connected, makeDonation } = useApp();
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");

  // New states for filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">(
    "all"
  );

  // Animation setup
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [campaignsRef, campaignsInView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  // Filter and search logic
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      // Status filter
      if (statusFilter === "active" && !campaign.isActive) return false;
      if (statusFilter === "closed" && campaign.isActive) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          campaign.name.toLowerCase().includes(query) ||
          campaign.description.toLowerCase().includes(query) ||
          campaign.campaignOwner.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [campaigns, statusFilter, searchQuery]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (loading && campaigns.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-12"
      >
        <p className="text-gray-600">
          <motion.span
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Loading campaigns...
          </motion.span>
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.h1
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.7 }}
        className="text-3xl font-bold mb-8"
      >
        Active Campaigns
      </motion.h1>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 h-4 w-4" />
          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "active" | "closed") =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="closed">Closed Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Results count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4 text-sm text-gray-600"
      >
        Showing {filteredCampaigns.length} of {campaigns.length} campaigns
      </motion.div>

      <motion.div
        ref={campaignsRef}
        variants={containerVariants}
        initial="hidden"
        animate={campaignsInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              custom={index}
              variants={itemVariants}
              layout
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden h-full border border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <CardTitle className="text-xl">{campaign.name}</CardTitle>
                    {campaign.isActive ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.05,
                          duration: 0.3,
                        }}
                      >
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.05,
                          duration: 0.3,
                        }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-800"
                        >
                          Closed
                        </Badge>
                      </motion.div>
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

                  {campaign.isActive ? (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{campaign.progress.toFixed(1)}%</span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          delay: 0.5 + index * 0.05,
                          duration: 0.7,
                          ease: "easeOut",
                        }}
                      >
                        <Progress value={campaign.progress} className="h-2" />
                      </motion.div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <div className="flex justify-center items-center text-sm text-gray-500 bg-gray-100 rounded p-2">
                        <span>Campaign Closed</span>
                      </div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.5 }}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-medium">
                      {campaign.amountRaised} ETH donated
                    </span>
                    <span className="text-gray-500">
                      Goal: {campaign.goal} ETH
                    </span>
                  </motion.div>
                </CardContent>

                <CardFooter className="flex justify-between pt-2">
                  <Link to={`/campaign/${campaign.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline">View Details</Button>
                    </motion.div>
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
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button variant="hero">Donate</Button>
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
                              Support this campaign with ETH. Your donation will
                              be recorded on the blockchain.
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
                                onChange={(e) =>
                                  setDonationAmount(e.target.value)
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Message (optional)
                              </label>
                              <Textarea
                                placeholder="Add a message with your donation"
                                value={donationMessage}
                                onChange={(e) =>
                                  setDonationMessage(e.target.value)
                                }
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
                                variant="hero"
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
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCampaigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-3 text-center py-12"
          >
            <p className="text-gray-600">
              {campaigns.length === 0 ? (
                <>
                  No campaigns found.{" "}
                  {connected ? (
                    <motion.span
                      whileHover={{ color: "#f97316", x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to="/create"
                        className="text-orange-600 hover:underline"
                      >
                        Create one to get started!
                      </Link>
                    </motion.span>
                  ) : (
                    "Connect your wallet to create a campaign."
                  )}
                </>
              ) : (
                "No campaigns match your search criteria."
              )}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ActiveCampaignsPage;
