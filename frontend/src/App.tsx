import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Subscriptions from './pages/Subscriptions';
import Tickets from './pages/Tickets';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ChatbotWidget from './components/Chatbot/ChatbotWidget';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="services" element={<Services />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ChatbotWidget />
    </Router>
  );
}

export default App;