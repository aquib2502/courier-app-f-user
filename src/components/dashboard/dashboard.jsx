"use client";
import React from "react";

const Dashboard = () => {
  return (
    <div className="relative w-full h-full p-6">
      {/* Background Image */}
      <div 
        className="absolute top-0 right-0 w-full h-full bg-cover bg-no-repeat -z-10" 
        style={{ backgroundImage: "url('./dashboard_image.png')" }}
      ></div>

      {/* Content
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Dashboard</h1>
        <p className="text-gray-600 mt-2">
          This is the dashboard content section. You can display stats, graphs, or any information here.
        </p>
      </div> */}
    </div>
  );
};

export default Dashboard;
