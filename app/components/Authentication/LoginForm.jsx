import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage, getFromLocalStorage } from '../../utils/localStorageUtils.js'; 

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = getFromLocalStorage('users') || [];
        const match = users.find((u) => u.username === username && u.password === password);

        if (match) {
            login(match);
            navigate('/');
            
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg flex flex-col gap-4"
        >
            <div>
                <label htmlFor="username" className="block mb-1 font-medium text-gray-700">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {error && <div className="text-red-600 text-center">{error}</div>}
            <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;