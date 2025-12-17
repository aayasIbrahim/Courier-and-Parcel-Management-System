import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <>
      <div className="bg-white flex flex-col items-center  px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
            Courier Management System
          </h1>
        </header>
      </div>
      <div className=" flex justify-center min-h-screen bg-white px-4">
        <LoginForm />

      </div>
    </>
  );
}
