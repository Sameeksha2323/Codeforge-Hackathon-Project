
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="animate-float mb-8">
            <img
              src="/lovable-uploads/45a81f67-90b3-43d3-9499-2a874a4d48be.png"
              alt="MediShare Logo"
              className="h-24 w-auto mx-auto"
            />
          </div>
          <h1 className="text-5xl font-bold text-medishare-dark mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! We couldn't find the page you're looking for.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-medishare-blue text-white font-medium rounded-md hover:bg-medishare-dark transition duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
