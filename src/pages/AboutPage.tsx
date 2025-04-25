// src/pages/AboutPage.tsx
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
  Linkedin,
  Mail,
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">About Donatrace</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Donatrace is a blockchain-based fundraising platform that
            revolutionizes how campaigns are created, managed, and tracked. We
            leverage the power of blockchain technology to ensure complete
            transparency and trust in the fundraising process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            How We Built Donatrace
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-orange-600" />
                  Smart Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built with Solidity smart contracts on the Ethereum
                  blockchain, ensuring immutable and transparent transactions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-orange-600" />
                  Modern Frontend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Developed using React, TypeScript, and Tailwind CSS for a
                  responsive and user-friendly interface.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-orange-600" />
                  Secure Wallet Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Integrated with MetaMask and other wallet providers using
                  ethers.js for secure transactions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  Holesky Testnet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Deployed on the Holesky testnet for development and testing
                  with real blockchain interactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Heart className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold">Transparent Donations</h3>
                <p className="text-gray-600">
                  Every donation is recorded on the blockchain
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold">Campaign Management</h3>
                <p className="text-gray-600">
                  Create, manage, and track campaigns easily
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-orange-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
            <li>• React & TypeScript</li>
            <li>• Tailwind CSS</li>
            <li>• Ethers.js</li>
            <li>• Solidity</li>
            <li>• React Router</li>
            <li>• Shadcn/ui</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <User className="h-6 w-6 text-orange-600" />
            Meet the Creator
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold">
              SC
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Sorayut Chroenrit</h3>
              <p className="text-gray-600 mb-4">
                Full Stack Developer & Blockchain Enthusiast
              </p>
              <p className="text-gray-600 mb-6">
                I'm passionate about creating decentralized applications that
                solve real-world problems. With a background in web development
                and a keen interest in blockchain technology, I built Donatrace
                to bring transparency and trust to the fundraising space. My
                goal is to empower both donors and campaign creators through
                technology.
              </p>

              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="https://github.com/SorayutChroenrit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Github className="h-5 w-5 text-gray-700" />
                </a>
                <a
                  href="mailto:sorayutwork@gmail.com"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Mail className="h-5 w-5 text-gray-700" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4">Ready to Start?</h2>
          <p className="text-gray-600 mb-6">
            Join the transparent fundraising revolution today!
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/campaigns">
              <Button variant="hero" size="lg">
                Browse Campaigns
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="secondary" size="lg">
                Create Campaign
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
