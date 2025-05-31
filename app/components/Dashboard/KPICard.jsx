const KPICard = ({ title, value, icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'border-blue-500 dark:border-blue-400',
        green: 'border-green-500 dark:border-green-400',
        red: 'border-red-500 dark:border-red-400',
        yellow: 'border-yellow-500 dark:border-yellow-400',
    };

    return (
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 ${colorClasses[color]} border-gray-200 dark:border-gray-700 transition-colors`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                {icon && <div className="flex-shrink-0">{icon}</div>}
            </div>
        </div>
    );
};

export default KPICard;