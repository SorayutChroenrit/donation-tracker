// src/pages/MyDonationsPage.tsx
import { useApp } from "../context/AppContext";
import UserDonationHistory from "../components/UserHistory";

const MyDonationsPage = () => {
  const { contract, readonlyContract, account, connected } = useApp();

  if (!connected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Please connect your wallet to view your donations.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Donations</h1>
      <UserDonationHistory
        contract={contract || readonlyContract}
        account={account}
      />
    </div>
  );
};

export default MyDonationsPage;
