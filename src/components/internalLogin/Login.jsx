import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Config/AxiosConfig";
import axios from "axios";
import ConfigV2 from "../../Config/ConfigV2";

const Login = () => {

    const [token, setToken] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        console.log(window.location.hostname)
        if (window.location.hostname !== "localhost") {
            navigate("/");
        }
    }, [])

    const updateToken = (e) => {
        setToken(e.target.value)
    }

    const verifyToken = () => {
      axios.get(`${ConfigV2.apiBaseUrl}/v2/admin/`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(item => {
            if (item.status == 200) {
                localStorage.setItem("access_token", token);
                navigate("/home")
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    return <div className="flex flex-col h-full pt-[100px] items-center">
        <div className="flex flex-col items-centeer h-full">
            
            <textarea className="border-[1px] p-[10px] rounded-lg" type="text" style={{ height: 150, width: 800 }} placeholder="Enter your token here" onChange={updateToken}></textarea>
            
            <button
                onClick={verifyToken}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mt-5 rounded-md shadow-md transition duration-300"
            >
                Sign in
            </button>
        </div>


    </div>
}

export default Login;