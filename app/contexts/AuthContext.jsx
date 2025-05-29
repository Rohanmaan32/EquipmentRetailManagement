import { useEffect, createContext, useState, useContext } from 'react';
import {saveToLocalStorage, getFromLocalStorage,removeFromLocalStorage} from '../utils/localStorageUtils.js'; 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const users = [
        { id: "1", role: "Admin", username: "admin@entnt.in", password: "admin123" },
        { id: "2", role: "Staff", username: "staff@entnt.in", password: "staff123" },
        { id: "3", role: "Customer", username: "customer@entnt.in", password: "cust123" },
        ];
        
    useEffect(() => {
        saveToLocalStorage('users',users);
        
        const curUser = getFromLocalStorage("curUser");
        if (curUser && curUser !== null) {
            setUser(curUser);
        }
    }, []);

   
    const login = (userData) => {
        setUser(userData);
        saveToLocalStorage("curUser",userData);
    };

    const logout = () => {
        setUser(null);
        removeFromLocalStorage("curUser");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};