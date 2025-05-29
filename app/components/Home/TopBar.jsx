import {useState} from 'react';
import { Link ,useLocation } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.jsx";

const links = [
    {name:'Home', path : '/'},
    {name:'Login', path : '/login'},
    {name:'Equipment', path :'/equipment'},

];

const Topbar = () => {
    const [menu,setMenu] = useState(false);
    const location = useLocation();
    const currentPage = links.find((page) => page.path === location.pathname)?.name || 'Home';
    const {user,logout} = useAuth();
    
    return (
        <>

            <div className="bg-blue-900 shadow-md fixed top-0 right-0 left-0 z-50">
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <div className='flex items-center'>
                        <button 
                            onClick={() => setMenu(!menu)} 
                            className="text-white p-2 border border-white rounded hover:bg-blue-800 transition-colors"
                        >
                            {menu ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className='flex-1 text-center'>
                        <h1 className="text-xl font-bold text-white">{currentPage}</h1>
                    </div>

                    <div className='flex items-center gap-4'>
                        {user ? (
                            <>
                                <span className='hidden sm:inline text-sm text-white'>Hello, {user.role}</span>
                                <button onClick={logout} className="text-sm text-blue-300 hover:underline">
                                    Logout
                                </button>
                            </>
                        ):(
                            <Link to="/login" className="text-sm text-blue-300 hover:underline">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
                menu ? 'translate-x-0' : '-translate-x-full'
            }`}>

                <div className="flex items-center justify-between p-4 bg-blue-900 text-white">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button 
                        onClick={() => setMenu(false)}
                        className="p-1 hover:bg-blue-800 rounded">
    
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>


                <nav className="p-4">
                    <ul className="space-y-2">
                        {links.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    onClick={() => setMenu(false)}
                                    className={`block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                                        location.pathname === link.path ? 'bg-blue-100 text-blue-600 font-medium' : ''
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {user && (
                    <div className="absolute bottom-4 left-4 right-4 border-t pt-4">
                        <div className="px-4 py-2 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Logged in as:</p>
                            <p className="font-medium text-gray-900">{user.role}</p>
                            <button 
                                onClick={() => {
                                    logout();
                                    setMenu(false);
                                }}
                                className="mt-2 text-sm text-red-600 hover:underline"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Topbar;
