import React,{ useState } from 'react';
import { auth } from "../firebase_config";
// import { getFirestore, getDoc, doc } from 'firebase/firestore';
import {
//   createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
//   signInWithPopup,
} from "firebase/auth";
// import {useDispatch} from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

// const backgroundImageUrl = 'https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80';


const LoginPage:React.FC = () => {

    // const dispatch = useDispatch();

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
    // try {
    //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //     console.log(userCredential);
    // } catch (err) {
    //     console.error(err);
    // }


        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            navigate("/admin/dashboard");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode,errorMessage);
            
        });
    };

    const signInWithGoogle = async () => {
    try {
        // const userCredential = await signInWithPopup(auth, googleProvider);
        // console.log(userCredential.user.uid);
        // var userIdToFind = userCredential.user.uid;
        // console.log(userCredential.user);
        // const userRef = doc(getFirestore(), 'users', userIdToFind);  
        // const userDoc = await getDoc(userRef);
        // if(userDoc.exists()){
        //     const userData = userDoc.data();
        //     console.log(userData);
        //     dispatch(LoginUser({
        //         userData,
        //     }));
            
        //     dispatch(fetchCartItems(userIdToFind));
        //     dispatch(fetchProducts());
        //     dispatch(fetchAllUsers());
        //     dispatch(fetchUserOrders(userIdToFind));
        //     // dispatch(fetchOrders());
        //     navigate("/");
        // }
        // else{
        //     const userData = {
        //         Address:[],
        //         uid: userCredential.user.uid,
        //         username: userCredential.user.displayName || 'New User',
        //         email: userCredential.user.email,
        //         profileImage:userCredential.user.photoURL,
        //         date:new Date().toLocaleString("en-US", {
        //             month: "short",
        //             day: "2-digit",
        //             year: "numeric",
        //           }),
        //       };
        //     const cartData = {
        //         cartItems : []
        //     }
        //     const orderData  = {
        //         orders :[]
        //     }

        //     const userRef = doc(collection(getFirestore(), 'users'), userCredential.user.uid);
        //     await setDoc(userRef, userData);

        //     const cartRef = doc(collection(getFirestore(), 'cart'), userCredential.user.uid);
        //     await setDoc(cartRef, cartData);

        //     const orderRef = doc(collection(getFirestore(),'orders_for_individual_users'),userCredential.user.uid)
        //     await setDoc(orderRef,orderData);

        //     dispatch(LoginUser({
        //         userData
        //     }))

        //     navigate("/");
        // }

        
    } catch (err) {
        console.error(err);
    }
    };


  return (
    <>
    <div className="flex flex-row w-full h-screen justify-center items-center">
    <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg  lg:max-w-4xl">
        <div className="hidden bg-cover lg:block lg:w-1/2" style={{ 
      backgroundImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh3Dkg-v9r-X3GeqxS_M3iR_x2Vs0E5XqSaWMcESi9BQ&s",
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}></div>

        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">


            <p className="mt-3 text-xl text-center text-gray-600 ">
                Welcome back!
            </p>


            <button onClick={signInWithGoogle} className="w-full flex items-center justify-center mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg  hover:bg-gray-50 ">
                <div className="px-4 py-2">
                    <svg className="w-6 h-6" viewBox="0 0 40 40">
                        <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="/FFC107" />
                        <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="/FF3D00" />
                        <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="/4CAF50" />
                        <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="/1976D2" />
                    </svg>
                </div>
                <span className="w-5/6 px-4 py-3 font-bold text-center">Continue with Google</span>
            </button>


            <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b lg:w-1/4"></span>

                <Link to="/" className="text-xs text-center text-gray-500 uppercase  hover:underline">or login
                    with email</Link>
                <span className="w-1/5 border-b  lg:w-1/4"></span>

            </div>

            <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="LoggingEmailAddress">Email Address</label>
                <input id="LoggingEmailAddress" className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg   focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" type="email" onChange={(e) => setEmail(e.target.value)}/>
            </div>
 
            <div className="mt-4">
                <div className="flex justify-between">
                    <label className="block mb-2 text-sm font-medium text-gray-600 " htmlFor="loggingPassword">Password</label>
                    <Link to="/" className="text-xs text-gray-500  hover:underline">Forget Password?</Link>
                </div>

                <input id="loggingPassword" className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg  focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300" type="password" onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className="mt-6">
                <button onClick={signIn} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform  bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                    Sign In
                </button>
            </div>

            <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b  md:w-1/4"></span>

                <Link to="/signup" className="text-xs text-gray-500 uppercase  hover:underline">or sign up</Link>

                <span className="w-1/5 border-b  md:w-1/4"></span>
            </div>
        </div>
    </div>


</div>
</>

  );
}

export default LoginPage
