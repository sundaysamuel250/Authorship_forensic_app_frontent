import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, OAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaApple, FaGoogle } from 'react-icons/fa6';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
   

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signInWithGoogle = async () => {
        setAuthing(true);
        try {
            const response = await signInWithPopup(auth, new GoogleAuthProvider());
            console.log(response.user.uid);

            // Fetch user details from Firestore
            const userRef = doc(db, 'users', response.user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                console.log("User Data:", userSnap.data());
            } else {
                console.log("No such document!");
            }

            toast.success("Login successful! Redirecting...");
            navigate('/admin-profile');
        } catch (error) {
            console.error(error);
            toast.error("Failed to login with Google. Please try again.");
        } finally {
            setAuthing(false);
        }
    };

    const signInWithApple = async () => {
        setAuthing(true);
        const provider = new OAuthProvider('apple.com');
        try {
            const response = await signInWithPopup(auth, provider);
            console.log(response.user.uid);

            // Fetch user details from Firestore
            const userRef = doc(db, 'users', response.user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                console.log("User Data:", userSnap.data());
            } else {
                console.log("No such document!");
            }

            toast.success("Login successful! Redirecting...");
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error("Failed to login with Apple. Please try again.");
        } finally {
            setAuthing(false);
        }
    };

    const signInWithEmail = async () => {
        setAuthing(true);
        setError('');
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response.user.uid);

            // Fetch user details from Firestore
            const userRef = doc(db, 'users', response.user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                console.log("User Data:", userSnap.data());
            } else {
                console.log("No such document!");
            }

            toast.success("Login successful! Redirecting...");
            navigate('/');
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred.');
            }
            toast.error("Failed to login. Please check your credentials.");
        } finally {
            setAuthing(false);
        }
    };

    return (
        <div className='w-full h-screen flex flex-col lg:flex-row'>
            <ToastContainer />

            <div className='hidden lg:flex w-1/2 h-full flex-col bg-[#282c34] items-center justify-center'>
            </div>

            <div className='w-full lg:w-1/2 h-full bg-[#1a1a1a] flex flex-col p-10 sm:p-16 md:p-20 justify-center'>
                <div className='w-full flex flex-col max-w-[450px] mx-auto'>
                    <div className='w-full flex flex-col mb-10 text-white'>
                        <h3 className='text-4xl font-bold font-sans mb-2'>Login</h3>
                        <p className='text-lg font-poppins mb-4'>Welcome Back! Please enter your details.</p>
                    </div>

                    <div className='w-full flex flex-col mb-6'>
                        <input
                            type='email'
                            placeholder='Email'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input
                            type='password'
                            placeholder='Password'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className='w-full flex flex-col mb-4'>
                        <button
                            className='w-full bg-transparent border border-[#ff664a] text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
                            onClick={signInWithEmail}
                            disabled={authing}>
                            Log In With Email and Password
                        </button>
                    </div>

                    {error && <div className='text-red-500 mb-4'>{error}</div>}

                    <div className='w-full flex items-center justify-center relative py-4'>
                        <div className='w-full h-[1px] bg-gray-500'></div>
                        <p className='text-lg absolute text-gray-500 bg-[#1a1a1a] px-2'>OR</p>
                    </div>

                    <div className='w-full flex flex-row gap-4 mt-7'>
                        <button
                            className='w-1/2 bg-white text-[#ff66c4] font-semibold rounded-md p-2 text-center flex items-center justify-center cursor-pointer'
                            onClick={signInWithGoogle}
                            disabled={authing}>
                            <FaGoogle className='mr-2' size={28} /> Google
                        </button>

                        <button
                            className='w-1/2 bg-[#ff66c4] text-[#ffffff] font-semibold rounded-md p-2 text-center flex items-center justify-center cursor-pointer'
                            onClick={signInWithApple}
                            disabled={authing}>
                            <FaApple className='mr-2' size={28}/> Apple
                        </button>
                    </div>
                </div>

                <div className='w-full flex items-center justify-center mt-10'>
                    <p className='text-sm font-normal text-gray-400'>Don't have an account? <span className='font-semibold text-[#ff66c4] cursor-pointer underline'><a href='/registers'>Sign Up</a></span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
