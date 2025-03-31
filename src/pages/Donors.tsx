
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Hospital, Building2, Tablets, ChevronRight, BarChart3, Shield, Clock } from "lucide-react";

const Donors = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-medishare-dark mb-6">Donors</h1>
              <p className="text-xl text-gray-600">Hospitals & Medical Institutions</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                <div className="bg-medishare-blue/10 p-6 rounded-full">
                  <Hospital className="h-16 w-16 text-medishare-blue" />
                </div>
                <div>
                  <p className="text-lg leading-relaxed text-gray-700">
                    Donors include hospitals, pharmaceutical companies, and other medical institutions willing to contribute 
                    surplus or near-expiry medicines for social welfare. These organizations play a crucial role in reducing 
                    medical waste while ensuring essential medicines reach those in need. Their contributions help bridge the 
                    healthcare gap by supporting NGOs that distribute medicines to underserved communities.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Tablets className="h-10 w-10 text-medishare-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Reduce Waste</h3>
                  <p className="text-gray-600">Turn surplus medicines into valuable resources for those in need.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <BarChart3 className="h-10 w-10 text-medishare-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Track Impact</h3>
                  <p className="text-gray-600">See the real-world difference your donations are making.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Shield className="h-10 w-10 text-medishare-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
                  <p className="text-gray-600">All donations follow regulatory guidelines and are properly tracked.</p>
                </div>
              </div>

              <div className="text-center mt-10">
                <Link to="/sign-in">
                  <Button className="bg-medishare-orange hover:bg-medishare-gold text-white px-8 py-6 text-lg rounded-md">
                    Sign In as a Donor
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Donors;
