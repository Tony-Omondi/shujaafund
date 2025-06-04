import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignUpLogin from './pages/SignUpLogin';
import CreateFundraiser from './pages/CreateFundraiser';
import FundraiserDetail from './pages/FundraiserDetail';
import ExploreFundraisers from './pages/ExploreFundraisers';
import UserDashboard from './pages/UserDashboard';
import ThankYou from './pages/ThankYou';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import TermsPrivacy from './pages/TermsPrivacy';
import './assets/styles.css';

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Header />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<SignUpLogin />} />
            <Route path="/create" element={<CreateFundraiser />} />
            <Route path="/fundraiser/:id" element={<FundraiserDetail />} />
            <Route path="/explore" element={<ExploreFundraisers />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms-privacy" element={<TermsPrivacy />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;