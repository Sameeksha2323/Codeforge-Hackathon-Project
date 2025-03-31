
import React from "react";

interface StatItemProps {
  number: string;
  label: string;
  delay: string;
}

const StatItem = ({ number, label, delay }: StatItemProps) => {
  // Split the number into two parts - the first part and the colored part
  const splitIndex = number.search(/[K%+]/);
  const firstPart = splitIndex !== -1 ? number.substring(0, splitIndex) : number;
  const coloredPart = splitIndex !== -1 ? number.substring(splitIndex) : "";

  return (
    <div className={`text-center py-8 md:py-0 animate-fade-in-up opacity-0`} style={{ animationDelay: delay }}>
      <div className="text-5xl md:text-6xl font-display font-bold">
        <span className="text-[#003A5D]">{firstPart}</span>
        <span className="text-[#F47920]">{coloredPart}</span>
      </div>
      <div className="text-sm md:text-base text-[#8E9196] uppercase tracking-wider mt-2 font-medium">{label}</div>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:border-r border-gray-200 flex justify-center">
            <StatItem number="10K+" label="HAPPY CUSTOMERS" delay="0.1s" />
          </div>
          <div className="md:border-r border-gray-200 flex justify-center">
            <StatItem number="100K+" label="ORGANIZATIONS AND NGOS" delay="0.3s" />
          </div>
          <div className="flex justify-center">
            <StatItem number="95%" label="SUCCESS RATE" delay="0.5s" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
