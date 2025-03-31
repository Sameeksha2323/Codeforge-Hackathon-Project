
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TrustedBy = () => {
  return (
    <section className="bg-medishare-dark/5 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6">
              <img
                src="/lovable-uploads/45a81f67-90b3-43d3-9499-2a874a4d48be.png"
                alt="MediShare Logo"
                className="h-20 w-auto"
              />
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Connecting surplus medicines with those in need. Join our mission for a healthier, more sustainable world.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="text-2xl font-display font-bold text-medishare-dark mb-6 text-center lg:text-left">
              Trusted By
            </h3>
            <ul className="space-y-4 text-medishare-blue">
              <li className="hover:text-medishare-orange transition-colors duration-300 text-center lg:text-left">
                <a href="https://www.udayfoundation.org/donate-medicines-delhi/" target="_blank" rel="noopener noreferrer">
                  Uday Foundation
                </a>
              </li>
              <li className="hover:text-medishare-orange transition-colors duration-300 text-center lg:text-left">
                <a href="https://serudsindia.org/donate-medicines-india-poor/" target="_blank" rel="noopener noreferrer">
                  SERUDS India
                </a>
              </li>
              <li className="hover:text-medishare-orange transition-colors duration-300 text-center lg:text-left">
                <a href="https://www.apexkidneyfoundation.org/patient-help-portal/medicines.php" target="_blank" rel="noopener noreferrer">
                  Apex Kidney Foundation
                </a>
              </li>
              <li className="hover:text-medishare-orange transition-colors duration-300 text-center lg:text-left">
                <a href="http://mangalamfoundation.org/mangalam-foundation-medical-center.html" target="_blank" rel="noopener noreferrer">
                  Mangalam Foundation
                </a>
              </li>
              <li className="hover:text-medishare-orange transition-colors duration-300 text-center lg:text-left">
                <a href="https://keralasamajam.org/" target="_blank" rel="noopener noreferrer">
                  Kerala Foundation
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center lg:items-end">
            <h3 className="text-2xl font-display font-bold text-medishare-dark mb-4 text-center lg:text-right">
              Request Medicines
            </h3>
            <p className="text-gray-600 mb-6 text-center lg:text-right">
              Are you a clinic or healthcare center in need of medicines?
            </p>
            <Link to="/recipients">
              <Button 
                className="bg-medishare-blue hover:bg-medishare-dark text-white font-medium px-6 py-2 rounded-md transition-all duration-300"
              >
                Request Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
