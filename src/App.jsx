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
import Login from './components/internalLogin/Login';
import PrivateRoutesScreen from './RoutesScreen/PrivateRoutes';

function App() {



  return (
    <Router>
      <Routes>

        <Route path='/internal/login' element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/*" element={<PrivateRoutesScreen />} />

    

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




