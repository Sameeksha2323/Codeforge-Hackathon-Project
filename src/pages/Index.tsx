import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import { getUser, isAuthenticated, UserData } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Check if user is authenticated
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {user ? (
          <WelcomeBack user={user} />
        ) : (
          <Hero />
        )}
        <Stats />
        <AboutPreview />
      </main>
      <Footer />
    </div>
  );
};

const WelcomeBack = ({ user }: { user: UserData }) => {
  const getDashboardLink = () => {
    switch(user.userType) {
      case "donor":
        return "/donor-dashboard";
      case "ngo":
        return "/ngo-dashboard";
      case "recipient":
        return "/recipient-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  const getUserTypeDisplay = () => {
    switch(user.userType) {
      case "donor":
        return "Donor";
      case "ngo":
        return "NGO Partner";
      case "recipient":
        return "Recipient";
      case "admin":
        return "Administrator";
      default:
        return "Member";
    }
  };

  return (
    <section className="pt-28 pb-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-medishare-dark mb-6">
            Welcome Back, {user.name || "MediShare " + getUserTypeDisplay()}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Continue your mission with MediShare to help bridge the gap in medication access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-medishare-orange hover:bg-medishare-gold text-white px-8"
            >
              <Link to={getDashboardLink()}>
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutPreview = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-medishare-dark mb-4">About MediShare</h2>
          <p className="text-lg text-gray-600 mb-8">
            At MediShare, we bridge the gap between surplus medicines and those in need. 
            Every year, ₹15,000-₹18,000 crore worth of medicines go to waste in India, 
            while millions struggle to access essential healthcare.
          </p>
          <p className="text-lg text-gray-600 mb-14">
            Our AI-powered platform enables efficient redistribution, optimizing the match 
            between surplus medicines and demand across multiple states.
          </p>
          <Link
            to="/about"
            className="inline-block bg-medishare-orange hover:bg-medishare-gold text-white font-medium px-8 py-4 rounded-md transition-colors duration-300 text-lg"
          >
            Learn More About Our Mission
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Index;
