import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/Logo.png";
import SsIcon from "../../assets/SsIcon.png";
import LoginImg from "../../assets/LoginImg.png";
import WelcomeImg from "../../assets/WlcomeImg.png";
import AccessRestricted from "../../assets/AccessResticted.png";


const Verify = () => {

  const navigate = useNavigate();
  const hash = window.location.hash.substring(1);
  const [searchParams] = useSearchParams(hash);
  const [error, shouldShowError] = useState(false);
  const calledRef = useRef(false);

 useEffect(() => {
  if (calledRef.current) return;
  calledRef.current = true;

  const code = searchParams.get("code");
  const location = searchParams.get("location");
  const idToken = searchParams.get("id_token");
  const accountsServer = searchParams.get("accounts-server");

  axios.get("https://ssconsoledevapi.qbatz.com/v2/agents/verify", {
    params: { code, location, accountsServer, idToken }
  })
  .then((response) => {
    if (response.status === 200) {
      console.log("response", response.data);
      
       const accessToken = response.data; // direct string

    localStorage.setItem("access_token", accessToken);

    navigate("/home");

    }
  })
  .catch((err) => {
    console.log("Verification failed:", err);
    shouldShowError(true);
  });

}, []);



return (
<>


    {error && (
  <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
    
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center animate-fadeIn">

      {/* Icon */}
        <div className="flex justify-center mb-6">
        <img
          src={AccessRestricted}
          alt="Access Restricted"
          className="w-40 md:w-48"
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Access Restricted..!
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6">
        You are not authorized to access the SmartStay Admin Console with this account.
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-3">

       <button
  onClick={() => {
    shouldShowError(false);
    window.location.href = "https://ssconsole.qbatz.com/v2/agents/authorize";
  }}
  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
>
  Go Back to Login
</button>


        <button
          onClick={() => shouldShowError(false)}
          className="border border-gray-300 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          Contact Support
        </button>

      </div>

    </div>

  </div>
)}

    </>
);



};

export default Verify;
