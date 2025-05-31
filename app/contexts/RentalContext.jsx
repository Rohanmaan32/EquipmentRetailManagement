import { createContext, useContext, useEffect, useState } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorageUtils';
import { useNotification } from './NotificationContext';
const RentalContext = createContext();

const rentalData = [
    {
        "id": "r1",
        "equipmentId": "eq2",
        "customerId": "3",
        "startDate": "2025-06-01",
        "endDate": "2025-06-05",
        "status": "Reserved"
    },
    {
        "id": "r2",
        "equipmentId": "eq6",
        "customerId": "3",
        "startDate": "2025-06-10",
        "endDate": "2025-06-15",
        "status": "Rented"
    },
    {
        "id": "r3",
        "equipmentId": "eq9",
        "customerId": "2",
        "startDate": "2025-05-20",
        "endDate": "2025-05-25",
        "status": "Returned"
    },
    {
        "id": "r4",
        "equipmentId": "eq10",
        "customerId": "1",
        "startDate": "2025-06-20",
        "endDate": "2025-06-30",
        "status": "Reserved"
    }
];

export const RentalProvider = ({ children }) => {
    const [rentals, setRentals] = useState([]);
    const { addNotification } = useNotification();
    useEffect(() => {
        const storedRentals = getFromLocalStorage('rentals');
        if (storedRentals && storedRentals.length > 0) {
            setRentals(storedRentals);
        } else {
            setRentals(rentalData);
            saveToLocalStorage('rentals', rentalData);
        }
    }, []);

    const addRental = (newRental) => {
        try {
            const updatedRentals = [...rentals, newRental];
            setRentals(updatedRentals);
            saveToLocalStorage('rentals', updatedRentals);
            addNotification('New rental order created successfully!', 'success');
            return { success: true, data: updatedRentals };
        } catch (error) {
            console.error('Error adding rental:', error);
            return { success: false, error: error.message };
        }
    };

    const updateRental = (rentalId, updatedData) => {
        try {
            const updatedRentals = rentals.map(rental =>
                rental.id === rentalId ? { ...rental, ...updatedData } : rental
            );
            setRentals(updatedRentals);
            saveToLocalStorage('rentals', updatedRentals);
            addNotification('New rental order updated successfully!', 'success');
            return { success: true, data: updatedRentals };
        } catch (error) {
            console.error('Error updating rental:', error);
            return { success: false, error: error.message };
        }
    };

    const removeRental = (rentalId) => {
        try {
            const updatedRentals = rentals.filter(rental => rental.id !== rentalId);
            setRentals(updatedRentals);
            saveToLocalStorage('rentals', updatedRentals);
            addNotification('Rental order removed successfully!', 'success');

            return { success: true, data: updatedRentals };

        } catch (error) {
            console.error('Error removing rental:', error);
            return { success: false, error: error.message };
        }
    };

    const getAllRentals = () => {
        return rentals;
    };

    const getRental = (rentalId) => {
        return rentals.find(rental => rental.id === rentalId) || null;
    };

    const getRentalsByStatus = (status) => {
        return rentals.filter(rental => rental.status === status);
    };

    const getRentalsByCustomer = (customerId) => {
        return rentals.filter(rental => rental.customerId === customerId);
    };

    const getRentalsByEquipment = (equipmentId) => {
        return rentals.filter(rental => rental.equipmentId === equipmentId);
    };

    const getRentalsByDateRange = (startDate, endDate) => {
        return rentals.filter(rental => {
            const rentalStart = new Date(rental.startDate);
            const rentalEnd = new Date(rental.endDate);
            const filterStart = new Date(startDate);
            const filterEnd = new Date(endDate);
            
            return (rentalStart <= filterEnd && rentalEnd >= filterStart);
        });
    };

    return (
        <RentalContext.Provider value={{
            rentals,
            addRental,
            updateRental,
            removeRental,
            getAllRentals,
            getRental,
            getRentalsByStatus,
            getRentalsByCustomer,
            getRentalsByEquipment,
            getRentalsByDateRange
        }}>
            {children}
        </RentalContext.Provider>
    );
};

export const useRental = () => {
    const context = useContext(RentalContext);
    if (!context) {
        throw new Error('useRental must be used within a RentalProvider');
    }
    return context;
};
