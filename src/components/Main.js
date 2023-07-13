import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import FoodMenu from '../pages/FoodMenu';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import Cocktails
 from '../pages/Cocktails';
const Main = ({ onLogin, onSignup, currentUser }) => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage onLogin={onLogin}/>} />
        <Route path='/signup' element={<SignupPage onSignup={onSignup}/>} />
        <Route path='/foodmenu' element={<FoodMenu currentUser={currentUser} />} />
        <Route path='/cocktails' element={<Cocktails currentUser={currentUser} />} />     
    </Routes>
  )
}

export default Main