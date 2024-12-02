/* useEffect: allows us to save items in React when the page is reloaded */
import React, { useState, useRef, useEffect } from 'react'; //useRef allows us to reference HTML (in this case, input from a textbox)
import { BrowserRouter as Router, Link, Routes, Route, Navigate} from 'react-router-dom'; //many import of BrowserRouter bc only one instance of each allowed inside a set of <></>
import {v4 as uuidv4} from 'uuid'; //create a unique id for each item. So no more duplicate keys.
import axios from 'axios';

//local imports
import './App.css';
import HomePage from './components/HomePage'
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import InventoryPage from './components/InventoryPage';
import RecipesPage from './components/RecipesPage';

function App() {

  //is passed into RecipesPage (added 12-1)
  const [inventoryItems, setInventoryItems] = useState([]);
      useEffect(() => {
        //Check if token. If there is a token, fetch inventory items
        const token = localStorage.getItem('token');
        if(token) {
            const fetchItems = async () => {
                try {
                    const items = await axios.get('http://localhost:3001/inventory', {
                        headers: {Authorization: `Bearer ${token}`}
                    });
                    setInventoryItems(items.data); //Store the fetched items
                } catch (error) {
                    console.error('Erro fetching inventory items: ', error);
                }
            };
            fetchItems(); //Call the function you just made, so you can acutally fetch the items
        }
    }, []); // Empty dependency array to run this effect only once when the component mounts   
  




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
          <Link to="/recipes">Recipes</Link>
          <Link to="/" onClick={handleLogout}>Logout</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/inventory" element={isAuthenticated() ? <InventoryPage /> : <Navigate to="/login" />} />
        <Route
          path="/recipes"
          element={isAuthenticated() ? <RecipesPage inventoryItems={inventoryItems} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>

  );
}

export default App;
