import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

// Dashboard Component - Displays user-specific content, including their name, photo, and allows logout
const Dashboard = () => {
  // State to store the user's full name, email, and photo URL
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  // React Router hook to navigate between pages
  const navigate = useNavigate();

  // useCallback hook to ensure the navigate function is stable
  const redirectToLogin = useCallback(() => navigate("/login"), [navigate]);

  // useEffect hook to handle authentication state changes
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If no user is logged in, redirect to login page
        redirectToLogin();
      } else {
        // If the user is authenticated, update the state with their full name, email, and photo URL
        setUserFullName(user.displayName || "User"); // Use displayName if available, otherwise fallback to "User"
        setUserEmail(user.email);
        setUserPhotoURL(user.photoURL || null); // Use the user's photo URL, if available
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [redirectToLogin]);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      // Attempt to sign the user out from Firebase Authentication
      await signOut(auth);
      
      // After successful logout, redirect to login page
      redirectToLogin();
    } catch (error) {
      // If an error occurs during logout, log it for debugging
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl text-center font-inter font-extralight  mb-4">Authorship Forensic Dashboard</h1>

        {/* User Info Section */}
        <div className="flex items-center justify-center mb-6">
          {/* User photo */}
          {userPhotoURL ? (
            <img
              src={userPhotoURL}
              alt="User Avatar"
              className="w-12 h-12 rounded-full mr-4"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center mr-4">
              <span className="text-white font-bold">A</span> {/* Placeholder if no photo */}
            </div>
          )}

          {/* Display welcome message with user's full name and email if authenticated */}
          <div>
            <p className="text-lg font-semibold"> Welcome, {userFullName}</p>
            <p className="text-sm text-gray-400">{userEmail}</p>
          </div>
        </div>

        {/* Action buttons: Upload Document and Logout */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => navigate("/upload")}
            className="bg-[#ff66c4] hover:bg-[#ff664c] text-[#fff] text-[16px] font-inter px-6 py-2 rounded shadow"
          >
            Upload Document
          </button>

          <button
            onClick={handleLogout}
            className="bg-[#ff664c] hover:bg-red-700 px-6 py-2 rounded shadow"
          >
            Logout
          </button>
        </div>

        {/* Additional features for the dashboard can be added below */}
        <p className="text-gray-300 text-center font-inter text-[18px]">Explore authorship results and document history here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
