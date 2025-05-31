import { useNotification } from '../../contexts/NotificationContext';

const NotificationItem = ({ notification, onDismiss }) => {
    let bgColor, textColor, iconPath;

    switch (notification.type) {
        case 'success':
            bgColor = 'bg-green-500 dark:bg-green-600';
            textColor = 'text-white';
            iconPath = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
            break;
        case 'error':
            bgColor = 'bg-red-500 dark:bg-red-600';
            textColor = 'text-white';
            iconPath = "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"; 
            break;
        case 'warning':
            bgColor = 'bg-yellow-500 dark:bg-yellow-600';
            textColor = 'text-gray-800 dark:text-white'; 
            iconPath = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"; // Warning triangle
            break;
        default:
            bgColor = 'bg-blue-500 dark:bg-blue-600';
            textColor = 'text-white';
            iconPath = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; 
    }

    return (
        <div 
            className={`mb-3 p-4 rounded-lg shadow-lg flex items-center justify-between w-full max-w-sm ${bgColor} ${textColor} transition-all duration-300 ease-in-out transform`}
            role="alert"
        >
            <div className="flex items-center">
                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
                </svg>
                <span className="text-sm">{notification.message}</span>
            </div>
            <button 
                onClick={() => onDismiss(notification.id)}
                className={`ml-4 p-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors`}
                aria-label="Dismiss notification"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

const NotificationList = () => {
    const { notifications, removeNotification } = useNotification();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end">
            {notifications.map(notification => (
                <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onDismiss={removeNotification} 
                />
            ))}
        </div>
    );
};

export default NotificationList;
   