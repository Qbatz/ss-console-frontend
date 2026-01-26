import React from "react"

const Index: React.FC = () => {

    const loginAction = async () => {
    // const response = await axios.get("http://localhost:8080/login/authorize")
    window.location.href = "http://localhost:8080/v2/agents/authorize"
    // window.location.href = "https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=1000.YLXF17CNZ2C016LL4WVTAQ8FRC6VWB&scope=email&redirect_uri=http://localhost:5173/verify"
  }
  
    return  <div style={{flex: 1, backgroundColor: 'white'}}>
      <div style={{backgroundColor: 'red', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5}} onClick={loginAction}>
        <label>Login</label>
      </div>
    </div>
}

export default Index