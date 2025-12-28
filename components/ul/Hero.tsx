import React from "react";
import { Button } from "@/components/ui/button";

function Hero() {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center "
      style={{
        backgroundImage:
          "url(https://www.shutterstock.com/image-photo/delivery-man-pushes-hand-truck-600nw-1701403291.jpg)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center text-white  mt-[100px] lg:mt-1 ">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-5 mt-9">
          Courier & Parcel <br className="hidden sm:block" />
          Management System
        </h1>

        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200">
          Streamline your deliveries, track parcels in real-time, and ensure
          faster, more reliable shipping for your business.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 text-base">
            Get Started
          </Button>
          <Button
            variant="outline"
            className="border-white text-black hover:bg-white hover:text-white hover:bg-black px-7 py-3 text-base"
          >
            Learn More
          </Button>
        </div>

        {/* Feature List (UL) */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <li className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">
              🚚 Real-time Tracking
            </h3>
            <p className="text-sm text-gray-200">
              Monitor all your parcels with live updates from pickup to delivery.
            </p>
          </li>

          <li className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">
              🔔 Automated Notifications
            </h3>
            <p className="text-sm text-gray-200">
              Keep customers informed with automatic SMS & email alerts.
            </p>
          </li>

          <li className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">
              🔒 Secure Deliveries
            </h3>
            <p className="text-sm text-gray-200">
              Ensure safe handling with verified delivery confirmation.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Hero;
