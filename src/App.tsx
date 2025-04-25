import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import HowToUsePage from "./pages/HowToUsePage";
import AboutPage from "./pages/AboutPage";
import { AppProvider } from "./context/AppContext";
import ActiveCampaignsPage from "./pages/ActiveCampaigns";
import CreateCampaignPage from "./pages/CreateCampaign";
import MyDonationsPage from "./pages/MyDonationPage";
import CampaignDetailPage from "./pages/CampaignDetailsPage";

function App() {
  return (
    <AppProvider>
      <Router>
        <Toaster richColors />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="campaigns" element={<ActiveCampaignsPage />} />
            <Route path="create" element={<CreateCampaignPage />} />
            <Route path="my-donations" element={<MyDonationsPage />} />
            <Route path="campaign/:id" element={<CampaignDetailPage />} />
            <Route path="how-to-use" element={<HowToUsePage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
