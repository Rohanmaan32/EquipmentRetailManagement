
import React, { useState } from 'react';
import {useAuth} from '.../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {saveToLocalStorage, getFromLocalStorage} from '../utils/localStorageUtils.js'; 

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const history = useNavigate();
    const {login} = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const users = getFromLocalStorage(users)
        const match = users.find((u) => u.username === username && u.password === password) 
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};   

export default LoginForm;