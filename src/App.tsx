
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NGOs from "./pages/NGOs";
import Donors from "./pages/Donors";
import Recipients from "./pages/Recipients";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import RecipientDashboard from "./pages/RecipientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./components/Chatbot";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/ngos" element={<NGOs />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/recipients" element={<Recipients />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
          <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
