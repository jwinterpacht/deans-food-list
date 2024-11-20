import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/login', {
                username,
                password,
            });
            //Store the token that keeps user logged in between page switches
            localStorage.setItem('token', response.data.token);

            //Redirect user to the HomePage
            navigate('/home');

            //Force page reload
            window.location.reload();
        } catch (error) {
            console.error('Login failed', error);
            alert('Invalid username or password');
        }
    };

    return (
        <div>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <h1>Login</h1>
            <input
                type="text"
                placeholder='Username'
                value={username}
                onChange={(username) => setUsername(username.target.value)}
            />
            <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(password) => setPassword(password.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
        </div>
    );

}//LoginPage()