import { useState } from 'react';

const KPICard = ({ title, value, icon, color = 'blue', exportData, detailData }) => {
    const [showMenu, setShowMenu] = useState(false);

    const colorClasses = {
        blue: 'border-blue-500 dark:border-blue-400',
        green: 'border-green-500 dark:border-green-400',
        red: 'border-red-500 dark:border-red-400',
        yellow: 'border-yellow-500 dark:border-yellow-400',
    };

    const handleExportCSV = () => {
        if (exportData && typeof exportData === 'function') {
            exportData('csv');
        }
        setShowMenu(false);
    };

    const handleExportJSON = () => {
        if (exportData && typeof exportData === 'function') {
            exportData('json');
        }
        setShowMenu(false);
    };

    return (
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 ${colorClasses[color]} border-gray-200 dark:border-gray-700 transition-colors relative`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                
                <div className="flex items-center gap-2">
                    {icon && <div className="flex-shrink-0">{icon}</div>}
                    
                    {exportData && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label="Export options"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                </svg>
                            </button>
                            
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                                    <button
                                        onClick={handleExportCSV}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Export CSV
                                    </button>
                                    <button
                                        onClick={handleExportJSON}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Export JSON
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {showMenu && (
                <div 
                    className="fixed inset-0 z-0" 
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
};

export default KPICard;
