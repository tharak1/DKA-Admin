import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { EmployeeModel } from '../Models/EmployeeModel';
import { loginUser } from '../redux/UserSlice';
import { useAppDispatch } from '../redux/PersistanceStorage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase_config'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import DKA from '../assets/DKA.png';

const LoginScreen: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [credentials, setCredentials] = useState<{ email: string; password: string }>({
        email: '',
        password: ''
    });

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setLoginError("");

        try {
            const authUser = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            const querySnapshot = await getDocs(query(collection(db, "employees"), where("uid", "==", authUser.user.uid)));

            let fetchedUser: EmployeeModel | null = null;
            querySnapshot.forEach((doc) => {
                fetchedUser = doc.data() as EmployeeModel;
            });

            if (fetchedUser) {
                dispatch(loginUser(fetchedUser));
                if ((fetchedUser as EmployeeModel).isAdmin) {
                    navigate('/admin/dashboard',{replace:true});
                } else {
                    navigate('/admin/manage_questionPaper',{replace:true});
                }
                console.log(fetchedUser);
            } else {
                setLoginError("User data not found");
            }
        } catch (error: any) {
            setLoginError(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link to="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-16 h-12 mr-2" src={DKA} alt="logo" />
                </Link>

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@company.com"
                                    required
                                    onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <div className='relative'>
                                    <input
                                        type={visible ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
                                        onClick={() => setVisible(!visible)}
                                    >
                                        {visible ? (
                                            <IoIosEye size={24} />
                                        ) : (
                                            <IoIosEyeOff size={24} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {!loading && loginError !== '' && (
                                <p className="text-center text-red-500">{loginError}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                disabled={loading}
                            >
                                {loading ? (
                                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C                                        89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginScreen;

