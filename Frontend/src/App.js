// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
// import Login from './Auth/Login/login';
// import LoginInputs from './Auth/Login/loginInput';

import EmailVerification from "./Auth/EmailVerification";
import SuperAdminAccess from "./Auth/SuperAdminAccess";
import OTP from "./Auth/OTP";
import Signup from "./Auth/Signup";
import Signin from "./Auth/Signin";
import UnAuthDevice from "./Auth/UnAuthDevice"

function App() {
  return (
    <div>
      {/* <h1 className='text-7xl text-center text-blue-500'>Hello World</h1> */}
      {/* <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/EmailVerification" element={<EmailVerification />} />
          <Route path="/SuperAdminAccess" element={<SuperAdminAccess />} />
          <Route path="/OTP" element={<OTP />} />
          <Route path="/UnAuthDevice" element={<UnAuthDevice />} />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}

export default App;
