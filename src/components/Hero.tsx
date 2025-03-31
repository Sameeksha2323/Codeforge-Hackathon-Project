
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-24 pb-16 md:pt-28 md:pb-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-medishare-dark/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="order-2 lg:order-1 space-y-6 max-w-2xl">
            <div className="animate-fade-in-up [animation-delay:0.2s] opacity-0">
              <h1 className="text-medishare-dark font-bold leading-tight text-balance">
                Leftover meds? Give them a <span className="text-medishare-orange">second life</span>—donate today!
              </h1>
            </div>
            
            <div className="animate-fade-in-up [animation-delay:0.4s] opacity-0">
              <p className="text-lg text-gray-700 mb-8 text-balance">
                Every dose matters. We connect surplus medicines from hospitals and clinics to NGOs, 
                ensuring life-saving treatments reach those in need. Join us in bridging the gap for a 
                healthier, more sustainable future.
              </p>
            </div>
            
            <div className="animate-fade-in-up [animation-delay:0.6s] opacity-0">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-medishare-orange text-white font-medium rounded-md hover:bg-medishare-gold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Register
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in-up [animation-delay:0.4s] opacity-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-medishare-teal/30 to-medishare-gold/30 rounded-full blur-xl opacity-70 animate-pulse-gentle"></div>
              <img
                src="/lovable-uploads/dc81236c-f714-4a2f-8b82-67bb47f7273c.png"
                alt="Medical professional with medicine"
                className="relative z-10 max-w-full w-auto h-auto max-h-[500px] animate-float rounded-3xl"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
