import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from './components/Login/Index'
import Verify from './components/Login/Verify';
import Home from './components/dashboard/Home';
import Proprietors from './components/ProprietorsScreen/Proprietors';


function App() {
 
  

  return (
    <Router>
        <Routes>
      <Route path='/' element={ <Index />}/>
       
      <Route path='/verify' element={<Verify />} />
      <Route path='/home' element={<Home />} />
      <Route path="/proprietors" element={<Proprietors />} />
    </Routes>
    </Router>
    
  )
}

export default App
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




