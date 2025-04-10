import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center  font-poppins text-[#ff66c4] mb-4">Welcome to Authorship Forensic</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-lg px-4 font-inter font-medium">
        Discover the power of AI-driven text analysis to identify authorship patterns and insights.
        Sign up to get started or log in if you already have an account.
      </p>
      <div className="flex space-x-4">
        <Link to="/register" className="bg-[#ff66c4] text-white px-4 py-2 rounded-lg hover:bg-[#ff66]">
          Sign Up
        </Link>
        <Link to="/login" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Login
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
