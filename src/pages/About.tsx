
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight, BarChart3, FileCheck, Zap } from "lucide-react";

const About = () => {
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
            <section className="mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-medishare-dark mb-6 text-center">About Us</h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-10 text-center">
                At MediShare, we are on a mission to bridge the gap between surplus medicine and those in need. 
                Every year, ₹15,000-₹18,000 crore worth of medicines go to waste in India, while over 190 million 
                people struggle to access essential healthcare.
              </p>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-medishare-dark mb-4">The Problem</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Nearly 50% of prescribed medicines go unused, leading to expiration, financial loss, and 
                  environmental harm. Improper disposal results in pharmaceutical contamination, affecting 
                  over 70% of water bodies worldwide.
                </p>

                <h2 className="text-2xl font-bold text-medishare-dark mb-4">Our Solution</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  MediShare is an AI-powered platform that enables hospitals and pharmacies to donate surplus 
                  medicines, connects them with verified NGOs and recipient institutions, and ensures efficient 
                  redistribution.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="bg-medishare-orange/10 p-3 rounded-full w-fit mb-4">
                      <Zap className="h-7 w-7 text-medishare-orange" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
                    <p className="text-gray-600">
                      Our system intelligently pairs surplus medicines with demand, optimizing distribution across multiple states.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="bg-medishare-blue/10 p-3 rounded-full w-fit mb-4">
                      <FileCheck className="h-7 w-7 text-medishare-blue" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">OCR-Based Verification</h3>
                    <p className="text-gray-600">
                      Automated extraction of medicine details ensures 99% accuracy and reduces manual effort by 80%.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="bg-green-100 p-3 rounded-full w-fit mb-4">
                      <BarChart3 className="h-7 w-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
                    <p className="text-gray-600">
                      We partner with 100+ verified organizations to ensure safe handling and delivery.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-medishare-dark mb-4">Our Impact</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  By reducing waste and improving access, we aim to save millions in healthcare costs and 
                  provide life-saving medicines to over 10 million underserved individuals annually. 
                  Join us in transforming surplus into life-saving solutions.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
