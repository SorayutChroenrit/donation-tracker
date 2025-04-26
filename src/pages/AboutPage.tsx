import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Code,
  Globe,
  Lock,
  Users,
  Heart,
  Laptop,
  User,
  Github,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { ReactElement, useEffect, useState } from "react";

// Define interfaces for data objects
interface BuildCard {
  icon: ReactElement;
  title: string;
  description: string;
}

interface Feature {
  icon: ReactElement;
  title: string;
  description: string;
}

const AboutPage = () => {
  // State to control animations
  const [animate, setAnimate] = useState(false);

  // Start animations after component mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Card data
  const buildCards: BuildCard[] = [
    {
      icon: <Code className="h-5 w-5 text-orange-600" />,
      title: "Smart Contracts",
      description:
        "Built with Solidity smart contracts on the Ethereum blockchain, ensuring immutable and transparent transactions.",
    },
    {
      icon: <Laptop className="h-5 w-5 text-orange-600" />,
      title: "Modern Frontend",
      description:
        "Developed using React, TypeScript, and Tailwind CSS for a responsive and user-friendly interface.",
    },
    {
      icon: <Lock className="h-5 w-5 text-orange-600" />,
      title: "Secure Wallet Integration",
      description:
        "Integrated with MetaMask and other wallet providers using ethers.js for secure transactions.",
    },
    {
      icon: <Globe className="h-5 w-5 text-orange-600" />,
      title: "Holesky Testnet",
      description:
        "Deployed on the Holesky testnet for development and testing with real blockchain interactions.",
    },
  ];

  // Features data
  const features: Feature[] = [
    {
      icon: <Heart className="h-6 w-6 text-orange-600 mt-1" />,
      title: "Transparent Donations",
      description: "Every donation is recorded on the blockchain",
    },
    {
      icon: <Users className="h-6 w-6 text-orange-600 mt-1" />,
      title: "Cause Management",
      description: "Create, manage, and track donation causes easily",
    },
  ];

  // Tech stack data
  const techStack: string[] = [
    "React & TypeScript",
    "Tailwind CSS",
    "Ethers.js",
    "Solidity",
    "React Router",
    "Shadcn/ui",
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, type: "spring", stiffness: 100 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.h1
        initial="hidden"
        animate={animate ? "visible" : "hidden"}
        variants={fadeIn}
        className="text-3xl font-bold mb-8"
      >
        About Donatrace
      </motion.h1>

      <div className="space-y-12">
        {/* Mission Section */}
        <motion.section
          initial="hidden"
          animate={animate ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <motion.h2
            variants={fadeInLeft}
            className="text-2xl font-semibold mb-4"
          >
            Our Mission
          </motion.h2>
          <motion.p variants={fadeIn} className="text-gray-600 mb-6">
            Donatrace is a blockchain-based donation platform that
            revolutionizes how causes are created, managed, and tracked. We
            leverage the power of blockchain technology to ensure complete
            transparency and trust in the donation process.
          </motion.p>
        </motion.section>

        {/* How We Built Section */}
        <motion.section
          initial="hidden"
          animate={animate ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <motion.h2
            variants={fadeInLeft}
            className="text-2xl font-semibold mb-6"
          >
            How We Built Donatrace
          </motion.h2>
          <motion.div
            initial="hidden"
            animate={animate ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {buildCards.map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={animate ? { scale: 1 } : { scale: 0 }}
                        transition={{
                          delay: 0.5 + index * 0.1,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        {item.icon}
                      </motion.div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial="hidden"
          animate={animate ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <motion.h2
            variants={fadeInLeft}
            className="text-2xl font-semibold mb-6"
          >
            Key Features
          </motion.h2>
          <motion.div
            initial="hidden"
            animate={animate ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInLeft}
                custom={index}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="flex items-start gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={animate ? { scale: 1 } : { scale: 0 }}
                  transition={{
                    delay: 0.8 + index * 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Technology Stack Section */}
        <motion.section
          initial="hidden"
          animate={animate ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 0.6 }}
          className="bg-orange-50 p-6 rounded-lg"
        >
          <motion.h2 variants={fadeIn} className="text-2xl font-semibold mb-4">
            Technology Stack
          </motion.h2>
          <motion.ul
            initial="hidden"
            animate={animate ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700"
          >
            {techStack.map((tech, index) => (
              <motion.li
                key={tech}
                variants={scaleIn}
                custom={index}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                • {tech}
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        {/* Creator Section */}
        <motion.section
          initial="hidden"
          animate={animate ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 0.8 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <motion.h2
            variants={fadeIn}
            className="text-2xl font-semibold mb-6 flex items-center gap-2"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={
                animate ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }
              }
              transition={{
                delay: 1.0,
                type: "spring",
                stiffness: 200,
              }}
            >
              <User className="h-6 w-6 text-orange-600" />
            </motion.div>
            Meet the Creator
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <motion.div
              initial={{ scale: 0 }}
              animate={animate ? { scale: 1 } : { scale: 0 }}
              transition={{
                delay: 1.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                rotate: [0, -5, 5, 0],
                transition: {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }}
              className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold"
            >
              SC
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={animate ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex-1 text-center md:text-left"
            >
              <h3 className="text-xl font-bold mb-2">Sorayut Chroenrit</h3>
              <p className="text-gray-600 mb-4">
                Full Stack Developer & Blockchain Enthusiast
              </p>
              <p className="text-gray-600 mb-6">
                I'm passionate about creating decentralized applications that
                solve real-world problems. With a background in web development
                and a keen interest in blockchain technology, I built Donatrace
                to bring transparency and trust to the donation space. My goal
                is to empower both donors and cause creators through technology.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="flex gap-4 justify-center md:justify-start"
              >
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  href="https://github.com/SorayutChroenrit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Github className="h-5 w-5 text-gray-700" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  href="mailto:sorayutwork@gmail.com"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Mail className="h-5 w-5 text-gray-700" />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          animate={animate ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 1.4 }}
          className="text-center py-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-2xl font-semibold mb-4"
          >
            Ready to Start?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={animate ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="text-gray-600 mb-6"
          >
            Join the transparent donation revolution today!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="flex justify-center gap-4"
          >
            <Link to="/campaigns">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="hero" size="lg" className="transition-all">
                  Browse Causes
                </Button>
              </motion.div>
            </Link>
            <Link to="/create">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="transition-all"
                >
                  Create Cause
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
