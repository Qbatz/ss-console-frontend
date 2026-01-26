import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from "axios";


const Verify : React.FC = () => {

        const navigate = useNavigate();
        const hash = window.location.hash.substring(1)
        const [searchParams] = useSearchParams(hash);
        const [error, shouldShowError] = useState(false)

        const calledRef = useRef(false);

    useEffect( () => {

        if (calledRef.current) return;
        calledRef.current = true;

        const code = searchParams.get('code')
        const location = searchParams.get('location')
        const idToken = searchParams.get('id_token');
        const accountsServer = searchParams.get('accounts-server')
        console.log(code)

        axios.get('http://localhost:8080/v2/agents/verify', {
            params: {
                code: code,
                location: location,
                accountsServer: accountsServer,
                idToken: idToken
            }
        }).then(response => {
             console.log(response)
             if (response.status == 200) {
                navigate("/home")
             }
             else {
                shouldShowError(true);
             }
        })

       

        //  window.location.href = "http://localhost:8080/login/verify?code=" + code + "&location=" + location + "&authorizeUrl="+ accountsServer

    }, [])

    return <div>
        <label style={{color: 'black'}}>Veryfying page</label>
        {
            error && <label>You do not having the access to the portal</label>
        }
    </div>
}

export default Verify;