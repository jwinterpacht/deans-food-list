import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const[error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:3001/signup', { //if this doesn't work, change to: http://localhost:3001/signup
                username,
                password,
            });
            alert('Account created successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            alert('Username already taken. Please try again.')
            console.error('Signup failed', error);
            setError(error.response?.data?.error || 'An error occured during signup.');
        }
    };


    return (
        <div>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <h1>Create an Account</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(the_username) => setUsername(the_username.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(the_password) => setPassword(the_password.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    )
}

