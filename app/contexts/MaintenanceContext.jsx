import { createContext, useContext, useEffect, useState } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorageUtils';

const MaintenanceContext = createContext();

const maintenanceData = [
    {
        "id": "m1",
        "equipmentId": "eq5",
        "date": "2025-05-15",
        "type": "Routine Inspection",
        "notes": "Regular monthly inspection completed. All systems operational.",
        "status": "Completed"
    },
    {
        "id": "m2",
        "equipmentId": "eq7",
        "date": "2025-05-20",
        "type": "Repair",
        "notes": "Fixed hydraulic leak in main cylinder. Replaced seals.",
        "status": "Completed"
    },
    {
        "id": "m3",
        "equipmentId": "eq8",
        "date": "2025-05-25",
        "type": "Preventive Maintenance",
        "notes": "Oil change and filter replacement. Engine tune-up required.",
        "status": "In Progress"
    },
    {
        "id": "m4",
        "equipmentId": "eq5",
        "date": "2025-06-01",
        "type": "Scheduled Service",
        "notes": "Upcoming scheduled maintenance for concrete mixer.",
        "status": "Scheduled"
    }
];

export const MaintenanceProvider = ({ children }) => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);

    useEffect(() => {
        const storedMaintenance = getFromLocalStorage('maintenance');
        if (storedMaintenance && storedMaintenance.length > 0) {
            setMaintenanceRecords(storedMaintenance);
        } else {
            setMaintenanceRecords(maintenanceData);
            saveToLocalStorage('maintenance', maintenanceData);
        }
    }, []);

    const addMaintenanceRecord = (newRecord) => {
        try {
            const updatedRecords = [...maintenanceRecords, newRecord];
            setMaintenanceRecords(updatedRecords);
            saveToLocalStorage('maintenance', updatedRecords);
            return { success: true, data: updatedRecords };
        } catch (error) {
            console.error('Error adding maintenance record:', error);
            return { success: false, error: error.message };
        }
    };

    const updateMaintenanceRecord = (recordId, updatedData) => {
        try {
            const updatedRecords = maintenanceRecords.map(record =>
                record.id === recordId ? { ...record, ...updatedData } : record
            );
            setMaintenanceRecords(updatedRecords);
            saveToLocalStorage('maintenance', updatedRecords);
            return { success: true, data: updatedRecords };
        } catch (error) {
            console.error('Error updating maintenance record:', error);
            return { success: false, error: error.message };
        }
    };

    const removeMaintenanceRecord = (recordId) => {
        try {
            const updatedRecords = maintenanceRecords.filter(record => record.id !== recordId);
            setMaintenanceRecords(updatedRecords);
            saveToLocalStorage('maintenance', updatedRecords);
            return { success: true, data: updatedRecords };
        } catch (error) {
            console.error('Error removing maintenance record:', error);
            return { success: false, error: error.message };
        }
    };

    const getAllMaintenanceRecords = () => {
        return maintenanceRecords;
    };

    const getMaintenanceRecord = (recordId) => {
        return maintenanceRecords.find(record => record.id === recordId) || null;
    };

    const getMaintenanceByEquipment = (equipmentId) => {
        return maintenanceRecords.filter(record => record.equipmentId === equipmentId);
    };

    const getMaintenanceByStatus = (status) => {
        return maintenanceRecords.filter(record => record.status === status);
    };

    const getMaintenanceByType = (type) => {
        return maintenanceRecords.filter(record => record.type === type);
    };

    return (
        <MaintenanceContext.Provider value={{
            maintenanceRecords,
            addMaintenanceRecord,
            updateMaintenanceRecord,
            removeMaintenanceRecord,
            getAllMaintenanceRecords,
            getMaintenanceRecord,
            getMaintenanceByEquipment,
            getMaintenanceByStatus,
            getMaintenanceByType
        }}>
            {children}
        </MaintenanceContext.Provider>
    );
};

export const useMaintenance = () => {
    const context = useContext(MaintenanceContext);
    if (!context) {
        throw new Error('useMaintenance must be used within a MaintenanceProvider');
    }
    return context;
};
