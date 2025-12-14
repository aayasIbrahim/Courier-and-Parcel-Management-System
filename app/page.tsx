import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center  px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
            Courier Management System
          </h1>
          <p className="text-gray-700 text-base md:text-lg max-w-md mx-auto">
            Manage parcels efficiently with a{" "}
            <span className="font-semibold">role-based dashboard</span>, track
            deliveries in real-time, and update parcel statuses seamlessly.
            Access the system by logging in below.
          </p>
        </header>

        {/* Features Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 md:mb-12 w-full max-w-4xl">
          <div className="flex-1 bg-white p-5 md:p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg md:text-xl font-bold mb-2">
              Role-Based Dashboards
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Admin, Delivery Agents, and Customers have their own dashboards
              for efficient parcel management.
            </p>
          </div>
          <div className="flex-1 bg-white p-5 md:p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg md:text-xl font-bold mb-2">
              Parcel Tracking System
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Track your parcels in real-time from pickup to delivery and view
              parcel history.
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
    </>
  );
}
