import React from "react";
import { Button } from "@/components/ui/button";

function Hero() {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://www.shutterstock.com/image-photo/delivery-man-pushes-hand-truck-600nw-1701403291.jpg)",
      }}
    >
      {/* Overlay */}


      {/* Hero Content */}
      <div className="relative z-10 text-center text-slate-700   px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-white">
          Courier & Parcel Management System
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-8">
          Streamline your deliveries, track parcels in real-time, and ensure
          faster, more reliable shipping for your business.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-black hover:bg-gray-700 text-white px-6 py-3">
            Get Started
          </Button>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3">
            Learn More
          </Button>
        </div>

        {/* Feature List */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="bg-teal-500 bg-opacity-10 rounded-xl p-6 hover:bg-opacity-20 transition">
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-sm text-gray-200">
              Monitor all your parcels with live updates from pickup to
              delivery.
            </p>
          </div>
          <div className="bg-teal-500 bg-opacity-10 rounded-xl p-6 hover:bg-opacity-20 transition">
            <h3 className="text-xl font-semibold mb-2">Automated Notifications</h3>
            <p className="text-sm text-gray-200">
              Keep your customers informed with automatic SMS & email updates.
            </p>
          </div>
          <div className="bg-teal-500 bg-opacity-10 rounded-xl p-6 hover:bg-opacity-20 transition">
            <h3 className="text-xl font-semibold mb-2">Secure Deliveries</h3>
            <p className="text-sm text-gray-200">
              Ensure parcels are handled safely with verified delivery protocols.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
