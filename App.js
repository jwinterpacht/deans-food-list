/* useEffect: allows us to save items in React when the page is reloaded */
import React, { useState, useRef, useEffect } from 'react'; //useRef allows us to reference HTML (in this case, input from a textbox)
import { BrowserRouter as Router, Link, Routes, Route, Navigate} from 'react-router-dom'; //many import of BrowserRouter bc only one instance of each allowed inside a set of <></>
import {v4 as uuidv4} from 'uuid'; //create a unique id for each item. So no more duplicate keys.

//local imports
import './App.css';
import HomePage from './components/HomePage'
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import InventoryPage from './components/InventoryPage';

function App() {

  const [isAuthentic, setIsAuthentic] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token; //!! converts token to a bool
  })

  const handleLogout = () => {
    localStorage.removeItem('token'); //Remove the token when logging out
    setIsAuthentic(false);
    console.log('User has logged out');
  }

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    /* Return token as a bool. Return value of authentication. Both must be true for authentication to pass. */
    console.log(!!token);
    return !!token && isAuthentic;
  }

  return (
    <Router>
      <header>
        <h1>Deans Food List</h1>
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/signup">SignUp</Link>
          <Link to="/login">Login</Link>
          <Link to="/inventory">Inventory</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
    </Router>

  );
}

export default App;
