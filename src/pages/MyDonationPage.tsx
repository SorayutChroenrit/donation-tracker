import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import UserDonationHistory from "../components/UserHistory";
import { motion } from "framer-motion";

const MyDonationsPage = () => {
  const { contract, readonlyContract, account, connected } = useApp();
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

  if (!connected) {
    return (
      <motion.div
        initial="hidden"
        animate={animate ? "visible" : "hidden"}
        variants={fadeInUp}
        className="text-center py-12"
      >
        <motion.h2 variants={fadeInUp} className="text-2xl font-bold mb-4">
          Connect Your Wallet
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="text-gray-600"
        >
          Please connect your wallet to view your donation history.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.7 }}
        className="text-3xl font-bold mb-8"
      >
        My Donations
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <UserDonationHistory
          contract={contract || readonlyContract}
          account={account}
        />
      </motion.div>
    </div>
  );
};

export default MyDonationsPage;
