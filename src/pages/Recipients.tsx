
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Building2, Users, Stethoscope, ChevronRight, HeartPulse, FileCheck, PenTool } from "lucide-react";

const Recipients = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold text-medishare-dark mb-6">Recipients</h1>
              <p className="text-xl text-gray-600">Small Clinics & Mohalla Clinics</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                <div className="bg-medishare-blue/10 p-6 rounded-full">
                  <Building2 className="h-16 w-16 text-medishare-blue" />
                </div>
                <div>
                  <p className="text-lg leading-relaxed text-gray-700 mb-5">
                    Recipients are small healthcare centers, mohalla clinics, and other community-based medical facilities 
                    that serve underprivileged populations. They receive medicines from NGOs to support their patients, 
                    ensuring that essential healthcare services remain accessible to those who might otherwise struggle to 
                    afford medications.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    By participating in this network, recipients can enhance their capacity to provide quality healthcare to local communities.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <HeartPulse className="h-10 w-10 text-medishare-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Access Medicines</h3>
                  <p className="text-gray-600">Request essential medicines for your patients and community.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <FileCheck className="h-10 w-10 text-medishare-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Verify Quality</h3>
                  <p className="text-gray-600">All medicines are verified for quality and expiration dates.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Stethoscope className="h-10 w-10 text-medishare-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Improve Care</h3>
                  <p className="text-gray-600">Enhance your ability to provide quality healthcare services.</p>
                </div>
              </div>

              <div className="text-center mt-10">
                <Link to="/sign-in">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-md">
                    Sign In as a Recipient
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

export default Recipients;
