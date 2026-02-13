// import React from "react"

// const Index: React.FC = () => {

//     const loginAction = async () => {
//     // const response = await axios.get("http://localhost:8080/login/authorize")
//     window.location.href = "https://ssconsole.qbatz.com/v2/agents/authorize"
//     // window.location.href = "https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=1000.YLXF17CNZ2C016LL4WVTAQ8FRC6VWB&scope=email&redirect_uri=http://localhost:5173/verify"
//   }
  
//     return  <div style={{flex: 1, backgroundColor: 'white'}}>
//       <div style={{backgroundColor: 'red', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5}} onClick={loginAction}>
//         <label>Login</label>
//       </div>
//     </div>
// }

// export default Index

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/Logo.png";
import SsIcon from "../../assets/SsIcon.png";
import LoginImg from "../../assets/LoginImg.png";
import WelcomeImg from "../../assets/WlcomeImg.png";
import AccessRestricted from "../../assets/AccessResticted.png";
import ConfigV2 from "../../Config/ConfigV2";



const Index = () => {
  const navigate = useNavigate();
  //   useEffect(() => {

  //   if (calledRef.current) return;
  //   calledRef.current = true;

  //   const code = searchParams.get("code");
  //   const location = searchParams.get("location");
  //   const idToken = searchParams.get("id_token");
  //   const accountsServer = searchParams.get("accounts-server");

  //   axios.get("https://ssconsole.qbatz.com/v2/agents/verify", {
  //     params: { code, location, accountsServer, idToken }
  //   })
  //   .then(response => {
  //     if (response.status === 200) {
  //       navigate("/home");
  //     } else {
  //       shouldShowError(true);
  //     }
  //   });

  // }, []);

  const loginAction = () => {
    window.location.href = ConfigV2.apiBaseUrl + "/v2/agents/authorize";
  };


  return (
  <div className="min-h-screen flex flex-col relative overflow-hidden">
 
       {/* Top Left Logo */}
       <div className="absolute top-6 left-6">
         <img src={Logo} alt="Logo" className="h-8 md:h-10" />
       </div>
 
       {/* Center Content */}
       <div className="flex flex-1 items-center justify-center px-4">
         <div className="text-center max-w-md w-full">
 
           {/* Smartstay Icon */}
           <div className="flex justify-center mb-4">
             <img src={SsIcon} alt="Smartstay" className="h-10 md:h-12" />
           </div>
 
           {/* Title */}
           <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
             Smartstay
           </h1>
 
           {/* Subtitle */}
           <p className="text-gray-600 text-sm md:text-base mb-6">
             Login in to access Smartstay Console.
           </p>
 
           {/* Button */}
           <button
             onClick={loginAction}
             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition duration-300"
           >
             Sign in
           </button>
 
           {/* Help Text */}
           <p className="text-xs text-gray-500 mt-4">
             Having trouble signing in? Contact your Super Admin or SmartStay support.
           </p>
 
         </div>
       </div>
 
       {/* Bottom Illustration */}
       <div className="absolute bottom-0 w-full pointer-events-none">
         <img
           src={WelcomeImg}
           alt="City"
           className="w-full opacity-40"
         />
       </div>
 
     </div>
  );
};

export default Index;
