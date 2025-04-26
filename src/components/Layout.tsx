import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import WalletConnection from "../components/WalletModel";
import { Button } from "../components/ui/button";

const Layout = () => {
  const { handleWalletConnect, connected } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/campaigns", label: "Active Campaigns" },
    ...(connected ? [{ path: "/create", label: "Create Campaign" }] : []),
    ...(connected ? [{ path: "/my-donations", label: "My Donations" }] : []),
    { path: "/how-to-use", label: "How to Use" },
    { path: "/about", label: "About" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={`sticky top-0 z-50 bg-white ${
          scrolled ? "shadow-md" : "shadow-sm"
        } transition-all duration-300`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center space-x-2">
                <motion.h1
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent"
                >
                  Donatrace
                </motion.h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <motion.span whileHover={{ scale: 1.05 }}>
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <WalletConnection
                  onConnect={handleWalletConnect}
                  requiredChainId={17000}
                  buttonClassName="min-w-[150px]"
                />
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center md:hidden"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2"
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Menu className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden pb-4"
              >
                <motion.div className="flex flex-col space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                          location.pathname === link.path
                            ? "bg-orange-100 text-orange-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="pt-4"
                  >
                    <WalletConnection
                      onConnect={handleWalletConnect}
                      requiredChainId={17000}
                      buttonClassName="w-full"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-sm text-gray-500"
            >
              Donatrace powered by Blockchain
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="text-xs text-yellow-700 bg-yellow-50 px-4 py-2 rounded-md"
            >
              Always verify the authenticity of campaigns before donating.
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;
