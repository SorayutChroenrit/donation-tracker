import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { campaigns, connected } = useApp();
  const [statsVisible, setStatsVisible] = useState(false);

  // Animation refs for different sections
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [howItWorksRef, howItWorksInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.isActive).length,
    totalRaised: campaigns.reduce(
      (acc, c) => acc + parseFloat(c.amountRaised),
      0
    ),
  };

  // For number animations in stats
  useEffect(() => {
    if (statsInView) {
      setStatsVisible(true);
    }
  }, [statsInView]);

  // Card stagger animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Step animation variants
  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="space-y-8">
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center py-12 md:py-20"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
        >
          Transparent Fundraising with Blockchain
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Create and support campaigns with complete transparency. Every
          donation is recorded on the blockchain.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/campaigns">
            <Button
              variant="hero"
              size="lg"
              className="w-full sm:w-auto transition-all hover:scale-105"
            >
              View Campaigns
            </Button>
          </Link>
          {connected ? (
            <Link to="/create">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto transition-all hover:scale-105"
              >
                Create Campaign
              </Button>
            </Link>
          ) : (
            <Link to="/how-to-use">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto transition-all hover:scale-105"
              >
                Learn How It Works
              </Button>
            </Link>
          )}
        </motion.div>
      </motion.section>

      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Total Campaigns",
            value: stats.totalCampaigns,
            color: "text-orange-600",
          },
          {
            title: "Active Campaigns",
            value: stats.activeCampaigns,
            color: "text-green-600",
          },
          {
            title: "Total Raised",
            value: `${stats.totalRaised.toFixed(0)} ETH`,
            color: "text-blue-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            custom={i}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.p
                  className={`text-3xl font-bold text-center ${stat.color}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={
                    statsVisible
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.5, opacity: 0 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.2,
                    type: "spring",
                    stiffness: 150,
                  }}
                >
                  {stat.value}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.section
        ref={howItWorksRef}
        initial={{ opacity: 0 }}
        animate={howItWorksInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-12"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={
            howItWorksInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
          }
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: 1,
              title: "Connect Wallet",
              description:
                "Connect your MetaMask wallet to start creating or supporting campaigns",
            },
            {
              step: 2,
              title: "Create or Donate",
              description:
                "Create a new campaign or support existing ones with ETH donations",
            },
            {
              step: 3,
              title: "Track Progress",
              description:
                "Monitor campaign progress and donations on the blockchain",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              custom={i}
              initial="hidden"
              animate={howItWorksInView ? "visible" : "hidden"}
              variants={stepVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="text-center p-6 rounded-lg bg-white hover:bg-orange-50 transition-all duration-300"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={howItWorksInView ? { scale: 1 } : { scale: 0 }}
                transition={{
                  delay: 0.3 + i * 0.2,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
                className="bg-orange-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-orange-600">
                  {item.step}
                </span>
              </motion.div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
