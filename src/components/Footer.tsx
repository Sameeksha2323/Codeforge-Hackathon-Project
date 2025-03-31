
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-medishare-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and about column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="mb-6 inline-block">
              <img 
                src="/lovable-uploads/45a81f67-90b3-43d3-9499-2a874a4d48be.png" 
                alt="MediShare Logo" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-gray-300 mt-4 text-sm">
              Bridging the gap between surplus medicine and those in need. 
              Join us in transforming surplus into life-saving solutions.
            </p>
          </div>

          {/* Quick links column */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-medishare-orange transition duration-300">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-medishare-orange transition duration-300">About Us</Link></li>
              <li><Link to="/donors" className="text-gray-300 hover:text-medishare-orange transition duration-300">Donate Medicines</Link></li>
              <li><Link to="/recipients" className="text-gray-300 hover:text-medishare-orange transition duration-300">Request Medicines</Link></li>
            </ul>
          </div>

          {/* Trusted By column */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Trusted By</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://main.mohfw.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-medishare-orange transition duration-300"
                >
                  Ministry of Health
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nmc.org.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-medishare-orange transition duration-300"
                >
                  State Medical Councils
                </a>
              </li>
              <li>
                <a 
                  href="https://www.apollohospitals.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-medishare-orange transition duration-300"
                >
                  Leading Hospital Chains
                </a>
              </li>
              <li>
                <a 
                  href="https://www.udayfoundation.org/donate-medicines-delhi/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-medishare-orange transition duration-300"
                >
                  National NGO Networks
                </a>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-medishare-orange mr-2 mt-0.5" />
                <span className="text-gray-300">123 MediShare Tower, Healthcare District, Mumbai, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-medishare-orange mr-2" />
                <span className="text-gray-300">+91 1234567890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-medishare-orange mr-2" />
                <span className="text-gray-300">info@medishare.org</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MediShare. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
