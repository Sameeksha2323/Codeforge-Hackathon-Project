
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Building2, Truck, ChevronRight, Shield, MapPin, Users } from "lucide-react";

const NGOs = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold text-medishare-dark mb-6">NGOs</h1>
              <p className="text-xl text-gray-600">Medicine Distributors & Facilitators</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                <div className="bg-medishare-blue/10 p-6 rounded-full">
                  <HeartHandshake className="h-16 w-16 text-medishare-blue" />
                </div>
                <div>
                  <p className="text-lg leading-relaxed text-gray-700">
                    NGOs act as the intermediaries between donors and recipients. They collect medicines from hospitals and 
                    other medical institutions, ensure proper storage and handling, and distribute them to clinics and 
                    community healthcare centers in need. Their role is vital in ensuring that the donated medicines reach 
                    the right people efficiently and safely. NGOs may also conduct awareness programs on proper medicine 
                    usage and healthcare accessibility.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <MapPin className="h-10 w-10 text-medishare-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Find Donors</h3>
                  <p className="text-gray-600">Easily connect with nearby hospitals and medical institutions.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Truck className="h-10 w-10 text-medishare-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Manage Distribution</h3>
                  <p className="text-gray-600">Track medicine inventory and coordinate efficient distribution.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Users className="h-10 w-10 text-medishare-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Serve Communities</h3>
                  <p className="text-gray-600">Make a direct impact on healthcare accessibility in underserved areas.</p>
                </div>
              </div>

              <div className="text-center mt-10">
                <Link to="/sign-in">
                  <Button className="bg-medishare-blue hover:bg-medishare-blue/90 text-white px-8 py-6 text-lg rounded-md">
                    Sign In as an NGO
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

export default NGOs;
