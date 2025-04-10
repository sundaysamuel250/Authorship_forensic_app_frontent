import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaApple, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa6";
import { auth } from "../firebase";
import { db } from "../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Oops! Your passwords don't match.");
      return;
    }
  
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter both your first and last name.");
      return;
    }
  
    setAuthing(true);
  
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User ID:", response.user.uid);
      // Add user data to Firestore
      await setDoc(doc(db, "users", response.user.uid), {
        firstName,
        lastName,
        email,
      });
      toast.success("Welcome aboard! Your account has been created.");
      setTimeout(() => navigate("/admin-profile"), 1500);
    } catch (err) {
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
  
        if (msg.includes("email-already-in-use")) {
          toast.error("That email is already registered. Try logging in instead.");
        } else if (msg.includes("invalid-email")) {
          toast.error("Hmm... that doesn't look like a valid email.");
        } else if (msg.includes("weak-password")) {
          toast.error("Your password is too weak. Try something stronger.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("Unexpected error. Please try again.");
      }
    } finally {
      setAuthing(false);
    }
  };

  const signUpWithGoogle = async () => {
    setAuthing(true);
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      console.log("User ID:", response.user.uid);

      // Add user data to Firestore
      await setDoc(doc(db, "users", response.user.uid), {
        firstName: response.user.displayName?.split(" ")[0] || "",
        lastName: response.user.displayName?.split(" ")[1] || "",
        email: response.user.email,
      });

      toast.success("Welcome aboard! Your Google account has been registered.");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign up with Google. Please try again.");
    } finally {
      setAuthing(false);
    }
  };

  const signUpWithApple = async () => {
    setAuthing(true);
    const provider = new OAuthProvider('apple.com');
    try {
      const response = await signInWithPopup(auth, provider);
      console.log("User ID:", response.user.uid);

      // Add user data to Firestore
      await setDoc(doc(db, "users", response.user.uid), {
        firstName: response.user.displayName?.split(" ")[0] || "",
        lastName: response.user.displayName?.split(" ")[1] || "",
        email: response.user.email,
      });

      toast.success("Welcome aboard! Your Apple account has been registered.");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign up with Apple. Please try again.");
    } finally {
      setAuthing(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <ToastContainer />
      <div className="w-full md:w-1/2 h-1/3 md:h-full flex flex-col bg-[#282c34] items-center justify-center"></div>

      <div className="w-full md:w-1/2 md:h-full h-screen bg-[#1a1a1a] flex flex-col p-8 md:p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          <div className="w-full flex flex-col mb-6 text-white text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4">Sign Up</h3>
            <p className="text-md font-poppins md:text-lg mb-4">
              Welcome! Please enter your information below.
            </p>
          </div>

          <div className="w-full flex flex-col mb-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full text-white py-2 mb-4 font-sans bg-transparent border-b border-gray-500 focus:outline-none focus:border-[#ff66c4]"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full text-white py-2 mb-4 font-sans bg-transparent border-b border-gray-500 focus:outline-none focus:border-[#ff66c4]"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full text-white py-2 mb-4 font-sans bg-transparent border-b border-gray-500 focus:outline-none focus:border-[#ff66c4]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-[#ff66c4] pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length > 0 && (
                <span
                  className="absolute right-2 top-2 cursor-pointer text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              )}
            </div>

            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-Enter Password"
                className="w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-[#ff66c4] pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword.length > 0 && (
                <span
                  className="absolute right-2 top-2 cursor-pointer text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col mb-4">
            <button
              onClick={handleRegister}
              disabled={authing}
              className="w-full bg-transparent font-sans border border-[#ff66c4] text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
            >
              Sign Up With Email and Password
            </button>
          </div>

          <div className="w-full flex items-center justify-center relative py-4">
            <div className="w-full h-[1px] bg-gray-500"></div>
            <p className="text-lg absolute text-gray-500 bg-[#1a1a1a] px-2">
              OR
            </p>
          </div>

          <div className="w-full flex flex-row gap-4 mt-7">
            <button
              className="w-1/2 bg-white text-[#ff66c4] font-semibold rounded-md p-2 text-center flex items-center justify-center cursor-pointer"
              disabled={authing}
              onClick={signUpWithGoogle}
            >
              <FaGoogle className="mr-2" size={28} /> Google
            </button>

            <button
              className="w-1/2 bg-[#ff66c4] text-white font-semibold rounded-md p-2 text-center flex items-center justify-center cursor-pointer"
              disabled={authing}
              onClick={signUpWithApple}
            >
              <FaApple className="mr-2" size={28} /> Apple
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-center mt-6">
          <p className="text-sm font-normal text-gray-400">
            Already have an account?{" "}
            <span className="font-semibold text-[#ff66c4] cursor-pointer underline">
              <a href="/login">Log In</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
