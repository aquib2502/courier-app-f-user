"use client";
import React from "react";
import Image from "next/image"; // Import Next.js Image component
import { Fullscreen } from "lucide-react";

const Dashboard = () => {
  return (
      <div className="min-h-[calc(220vh-200px)] flex flex-col">
    <div className="relative w-full h-screen p-6 overflow-hidden">
      {/* Background Image - Fixed */}
      <div 
        className="absolute inset-0 w-full h-full bg-auto bg-center opacity-90"
        style={{ 
          backgroundImage: "url('/air_cargo_image_2.jpg')", 
          zIndex: 0 
        }}
      ></div>
      
      {/* Alternative solution using Next.js Image */}
{/*       
      <Image
  src="/air_cargo_image_2.jpg"
  alt="Dashboard Background"
  fill
  sizes="100vw"
  priority
  style={{ objectFit: "contain" }}
  className="opacity-90 py"
/> */}
     

      {/* Content */}
      {/* <div className="relative z-10">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Dashboard</h1>
        <p className="text-gray-600 mt-2">
          This is the dashboard content section. You can display stats, graphs, or any information here.
        </p>
      </div> */}
    </div>
    </div>
  );
};

export default Dashboard;