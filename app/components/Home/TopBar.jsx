import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useDarkMode } from "../../contexts/DarkModeContext.jsx";

const links = [ 
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Home', path: '/' }, 
    { name: 'Login', path: '/login' },
    { name: 'Equipment', path: '/equipment' },
    { name: 'Rentals', path: '/rentals' },
    { name: 'Maintenance', path: '/maintenance' },
    { name: 'Calendar', path: '/calendar' }
];

const Topbar = () => {
    const [menu, setMenu] = useState(false);
    const location = useLocation();
    const currentPage = links.find((page) => page.path === location.pathname)?.name || 
                        (location.pathname === '/' ? 'Dashboard' : 'Page'); // Default to Dashboard for '/'
    const { user, logout } = useAuth();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    
    return (
        <>
            <div className="bg-blue-900 dark:bg-gray-900 shadow-md fixed top-0 right-0 left-0 z-50 transition-colors duration-200">
                <div className="flex items-center justify-between p-4"> 
                    <div className='flex items-center'>
                        <button 
                            onClick={() => setMenu(!menu)} 
                            className="text-white p-2 border border-white dark:border-gray-600 rounded hover:bg-blue-800 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle menu"
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

                    <div className='flex items-center gap-3'>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-white hover:bg-blue-800 dark:hover:bg-gray-800 transition-colors duration-200"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {user ? (
                            <>
                                <span className='hidden sm:inline text-sm text-white'>Hello, {user.role}</span>
                                <button 
                                    onClick={logout} 
                                    className="text-sm text-blue-300 dark:text-gray-300 hover:text-blue-100 dark:hover:text-white transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className="text-sm text-blue-300 dark:text-gray-300 hover:text-blue-100 dark:hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {menu && (
                <div 
                    className="fixed inset-0 z-40 bg-black/40 dark:bg-gray-900/80 transition-colors duration-200"
                    onClick={() => setMenu(false)}
                />
            )}

            <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-[60] transform transition-transform duration-300 ease-in-out ${ // Increased z-index for sidebar
                menu ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex items-center justify-between p-4 bg-blue-900 dark:bg-gray-900 text-white">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button 
                        onClick={() => setMenu(false)}
                        className="p-1 hover:bg-blue-800 dark:hover:bg-gray-800 rounded transition-colors"
                        aria-label="Close menu"
                    >
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
                                    className={`block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                                        location.pathname === link.path 
                                            ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium' 
                                            : ''
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="px-4 mb-4 mt-auto"> 
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="flex items-center gap-3">
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                </div>

                {user && (
                    <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Made user info sticky at bottom of sidebar */}
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as:</p>
                            <p className="font-medium text-gray-900 dark:text-white">{user.role}</p>
                            <button 
                                onClick={() => {
                                    logout();
                                    setMenu(false);
                                }}
                                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline w-full text-left"
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
