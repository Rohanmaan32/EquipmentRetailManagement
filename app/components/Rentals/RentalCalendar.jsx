import { useState, useMemo } from 'react';
import { useRental } from '../../contexts/RentalContext.jsx';
import { useEquipment } from '../../contexts/EquipmentContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const RentalCalendar = () => {
    const { getAllRentals } = useRental();
    const { getAllEquipment } = useEquipment();
    const { user } = useAuth();
    
    const allRentals = getAllRentals();
    const allEquipment = getAllEquipment();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const getEquipmentName = (equipmentId) => {
        const equipment = allEquipment.find(eq => eq.id === equipmentId);
        return equipment ? equipment.name : 'Unknown Equipment';
    };

    const getRentalsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return allRentals.filter(rental => {
            const startDate = new Date(rental.startDate);
            const endDate = new Date(rental.endDate);
            const checkDate = new Date(dateStr);
            return checkDate >= startDate && checkDate <= endDate;
        });
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const days = getDaysInMonth(currentDate);
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (!user) {
        return (
            <div className="min-h-screen w-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please log in to view the rental calendar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white dark:bg-gray-900 p-6 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rental Calendar</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{monthYear}</h3>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        if (!day) {
                            return <div key={index} className="h-24 border-r border-b border-gray-200 dark:border-gray-700"></div>;
                        }

                        const dayRentals = getRentalsForDate(day);
                        const isToday = day.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

                        return (
                            <div
                                key={index}
                                className={`h-24 border-r border-b border-gray-200 dark:border-gray-700 p-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                    isToday ? 'bg-blue-50 dark:bg-blue-900' : ''
                                } ${isSelected ? 'bg-blue-100 dark:bg-blue-800' : ''}`}
                                onClick={() => setSelectedDate(day)}
                            >
                                <div className={`text-sm font-medium mb-1 ${
                                    isToday ? 'text-blue-600 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
                                }`}>
                                    {day.getDate()}
                                </div>
                                <div className="space-y-1">
                                    {dayRentals.slice(0, 2).map(rental => (
                                        <div
                                            key={rental.id}
                                            className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 truncate"
                                            title={`${getEquipmentName(rental.equipmentId)} - Customer ${rental.customerId}`}
                                        >
                                            {getEquipmentName(rental.equipmentId)}
                                        </div>
                                    ))}
                                    {dayRentals.length > 2 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            +{dayRentals.length - 2} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedDate && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Rentals for {formatDate(selectedDate)}
                    </h3>
                    {getRentalsForDate(selectedDate).length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No rentals scheduled for this date.</p>
                    ) : (
                        <div className="space-y-3">
                            {getRentalsForDate(selectedDate).map(rental => (
                                <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {getEquipmentName(rental.equipmentId)}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Customer {rental.customerId} • {rental.startDate} to {rental.endDate}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        rental.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                        rental.status === 'Rented' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                        rental.status === 'Returned' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                    }`}>
                                        {rental.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RentalCalendar;
