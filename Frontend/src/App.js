import Login from './components/Login';
import BuildingDetails from './components/BuildingDetailsPage';
import BarChart from './components/BarChart';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import PrivateRoute from './Utils/PrivateRoute';
import { getToken, removeUserSession, setUserSession } from './Utils/Common';
import axios from 'axios';
function App() {

  const[authLoading,setAuthLoading] = useState(true);
  useEffect(()=>{
    const token = getToken();
    if (!token){
      return;
    }
    axios.get(`http://127.0.0.1:5000/verifyToken?token=${token}`)
    .then(response => {
      setUserSession(response.data.token, response.data.user);
      setAuthLoading(false);
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);

  if (authLoading && getToken()){
    return <div>Checking Authentication...</div>
  }

  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route
          path="/building"
          element={
            <PrivateRoute>
              <BuildingDetails/>
            </PrivateRoute>
          }
        />
        <Route
          path="/barchart"
          element={
            <PrivateRoute>
              <BarChart/>
            </PrivateRoute>
          }
        />
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
