// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../Config/AxiosConfig";
// import axios from "axios";
// import ConfigV2 from "../../Config/ConfigV2";

// const Login = () => {

//     const [token, setToken] = useState();
//     const navigate = useNavigate();


//     useEffect(() => {
//         console.log(window.location.hostname)
//         if (window.location.hostname !== "localhost") {
//             navigate("/");
//         }
//     }, [])

//     const updateToken = (e) => {
//         setToken(e.target.value)
//     }

//     const verifyToken = () => {
//       axios.get(`${ConfigV2.apiBaseUrl}/v2/admin/`, {
//             headers: {
//                 'Authorization': 'Bearer ' + token
//             }
//         })
//         .then(item => {
//             if (item.status == 200) {
//                 localStorage.setItem("access_token", token);
//                 navigate("/home")
//             }
//         })
//         .catch(error => {
//             console.log(error)
//         })
//     }

//     return <div className="flex flex-col h-full pt-[100px] items-center">
//         <div className="flex flex-col items-centeer h-full">
            
//             <textarea className="border-[1px] p-[10px] rounded-lg" type="text" style={{ height: 150, width: 800 }} placeholder="Enter your token here" onChange={updateToken}></textarea>
            
//             <button
//                 onClick={verifyToken}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mt-5 rounded-md shadow-md transition duration-300"
//             >
//                 Sign in
//             </button>
//         </div>


//     </div>
// }

// export default Login;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfigV2 from "../../Config/ConfigV2";

const Login = () => {

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hostname !== "localhost") {
      navigate("/");
    }
  }, []);

  // 🔹 Normal Token Login
  const verifyToken = async () => {
    try {
      const res = await axios.get(
        `${ConfigV2.apiBaseUrl}/v2/admin/`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (res.status === 200) {
        localStorage.setItem("access_token", token);
        navigate("/home");
      }
    } catch (err) {
      console.log("err1234567",err);
      
    }
  };

  
  const handleMockLogin = async () => {
    if (!email) {
      alert("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
  `${ConfigV2.apiBaseUrl}/v2/agents/mock-agent-login`,
  { params: { email } }
);

if (res.status === 200) {
  const mockToken = res.data;

  localStorage.setItem("mock_token", mockToken);
   localStorage.setItem("login_time", Date.now());

  navigate("/home");
}


    } catch (err) {
      console.log(err);
      alert("Mock login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full pt-[100px] items-center">

      <div className="flex flex-col gap-6 w-[800px]">

        {/* 🔹 Token Login */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-lg">Token Login</h2>

          <textarea
            className="border p-3 rounded-lg"
            style={{ height: 150 }}
            placeholder="Enter your token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <button
            onClick={verifyToken}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Sign in with Token
          </button>
        </div>

        {/* 🔹 Email Mock Login */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-lg">Mock Agent Login</h2>

          <input
            type="email"
            placeholder="Enter agent email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <button
            onClick={handleMockLogin}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login with Email"
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default Login;
