// import './App.css'
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Index from './components/Login/Index'
// import Verify from './components/Login/Verify';
// import Home from './components/dashboard/Home';
// import Proprietors from './components/ProprietorsScreen/Proprietors';
// import { RoleProvider } from './Context/RoleContext';
// import Roles from './components/RoleScreen/RoleList';
// import IamAdminUser from './components/AdminUser/AdminUserList';


// function App() {
 
//   const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("access_token");

//   return token ? children : <Navigate to="/" />;
// };


//   return (
//    <Router>
//   <Routes>
//     <Route path="/" element={<Index />} />
//     <Route path="/verify" element={<Verify />} />

//     <Route
//       path="/home"
//       element={
//         <RoleProvider>
//           <Home />
//         </RoleProvider>
//       }
//     />

//     <Route
//       path="/proprietors"
//       element={
//         <RoleProvider>
//           <Proprietors />
//         </RoleProvider>
//       }
//     />
//   </Routes>
// </Router>

    
//   )
// }

// export default App


import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from './components/Login/Index'
import Verify from './components/Login/Verify';
import Home from './components/dashboard/Home';
import Proprietors from './components/ProprietorsScreen/Proprietors';
import Roles from './components/RoleScreen/RoleList';
import IamAdminUser from './components/AdminUser/AdminUserList';
import { RoleProvider } from './Context/RoleContext';
import Properties from './components/PropertiesScreen/Properties';
import Subscription from './components/SubscriptionScreen/subscription';
import Billing from './components/BillingScreen/Billing';
import SupportTicket from './components/SupportTicketScreen/SupportTicket';
import CRMDashboard from './components/CRMDashboardScreen/CRMDashboard';
import {HostelProvider} from "./Context/HostelListContext"
import Login from './components/internalLogin/Login';


function App() {

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("access_token");
    return token ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <Routes>

        <Route path='/internal/login' element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/verify" element={<Verify />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <RoleProvider>
                <HostelProvider>
                <Home />
                </HostelProvider>
              </RoleProvider>
            </PrivateRoute>
          }
        />

        <Route
          path="/proprietors"
          element={
            <PrivateRoute>
              
              <RoleProvider>
                 <HostelProvider>
                <Proprietors />
                </HostelProvider>
              </RoleProvider>
              
            </PrivateRoute>
          }
        />

        {/* IAM Admin Pages */}
        <Route
          path="/iam-admin-user"
          element={
            <PrivateRoute>
              <RoleProvider>
                <HostelProvider>
                <IamAdminUser />
                </HostelProvider>
              </RoleProvider>
              
            </PrivateRoute>
          }
        />

        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <RoleProvider>
                 <HostelProvider>
                <Roles />
                </HostelProvider>
              </RoleProvider>
            </PrivateRoute>
          }
        />
          <Route
          path="/properties"
          element={
            <PrivateRoute>
              <RoleProvider>
                <HostelProvider>
                <Properties />
                </HostelProvider>
              </RoleProvider>
            </PrivateRoute>
          }
        />
           <Route
          path="/subscription"
          element={
            <PrivateRoute>
              <RoleProvider>
                <HostelProvider>
                <Subscription />
                </HostelProvider>
              </RoleProvider>
            </PrivateRoute>
          }
        />
         <Route
          path="/billing"
          element={
            <PrivateRoute>
              <RoleProvider>
                 <HostelProvider>
                <Billing />
                </HostelProvider>
              </RoleProvider>
            </PrivateRoute>
          }
        />
         <Route
          path="/supportTicket"
          element={
            <PrivateRoute>
              <RoleProvider>
                  <HostelProvider>
                <SupportTicket />
                </HostelProvider>
              </RoleProvider>
            </PrivateRoute>
          }
        />
         <Route
          path="/crmDashboard"
          element={
            <PrivateRoute>
              <RoleProvider>
                <HostelProvider>
                <CRMDashboard />
                </HostelProvider>
              </RoleProvider>
            </PrivateRoute>
          }
        />


      </Routes>
    </Router>
  );
}

export default App;

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Verify from './components/Login/Verify';
// import Home from './components/dashboard/Home';


// function App() {
//   return (
//     <Router>
//       <Routes>
       
      
//         <Route path='/verify' element={<Verify />} />
//         <Route path='/home' element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




