import { createContext, useContext, useEffect, useState } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorageUtils'; 

const EquipmentContext = createContext();

const equipmentdata = [
    {
        "id": "eq1",
        "name": "Paver",
        "category": "Earth Moving",
        "condition": "Good",
        "status": "Out of Service"
    },
    {
        "id": "eq2",
        "name": "Backhoe",
        "category": "Material Handling",
        "condition": "Excellent",
        "status": "Available"
    },
    {
        "id": "eq3",
        "name": "Forklift",
        "category": "Earth Moving",
        "condition": "Excellent",
        "status": "Available"
    },
    {
        "id": "eq4",
        "name": "Grader",
        "category": "Material Handling",
        "condition": "Good",
        "status": "Available"
    },
    {
        "id": "eq5",
        "name": "Concrete Mixer",
        "category": "Material Handling",
        "condition": "Excellent",
        "status": "Under Maintenance"
    },
    {
        "id": "eq6",
        "name": "Loader",
        "category": "Earth Moving",
        "condition": "Excellent",
        "status": "Available"
    },
    {
        "id": "eq7",
        "name": "Paver",
        "category": "Earth Moving",
        "condition": "Fair",
        "status": "Under Maintenance"
    },
    {
        "id": "eq8",
        "name": "Concrete Mixer",
        "category": "Earth Moving",
        "condition": "Poor",
        "status": "Under Maintenance"
    },
    {
        "id": "eq9",
        "name": "Backhoe",
        "category": "Material Handling",
        "condition": "Excellent",
        "status": "Rented"
    },
    {
        "id": "eq10",
        "name": "Loader",
        "category": "Construction",
        "condition": "Excellent",
        "status": "Rented"
    }
];
// id,name,category,condition,status all str
export const EquipmentProvider = ({ children }) => {
    const [equipment, setEquipment] = useState([]);

    useEffect(() => {
        const storedEquipment = getFromLocalStorage('equipment');
        if (storedEquipment && storedEquipment.length > 0) {
            setEquipment(storedEquipment);
        } else {
            setEquipment(equipmentdata);
            saveToLocalStorage('equipment', equipmentdata);
        }
    }, []);

    const addEquipment = (newEquipment) => {
        try {
            const updatedEquipment = [...equipment, newEquipment];
            setEquipment(updatedEquipment);
            saveToLocalStorage('equipment', updatedEquipment);
            return { success: true, data: updatedEquipment };
        } catch (error) {
            console.error('Error adding equipment:', error);
            return { success: false, error: error.message };
        }
    };

    const removeEquipment = (equipmentId) => {
        try {
            const updatedEquipment = equipment.filter(item => item.id !== equipmentId);
            setEquipment(updatedEquipment);
            saveToLocalStorage('equipment', updatedEquipment);
            return { success: true, data: updatedEquipment };
        } catch (error) {
            console.error('Error removing equipment:', error);
            return { success: false, error: error.message };
        }
    };

    const updateEquipment = (equipmentId, updatedData) => {
        try {
            const updatedEquipment = equipment.map(item => 
                item.id === equipmentId ? { ...item, ...updatedData } : item
            );
            setEquipment(updatedEquipment);
            saveToLocalStorage('equipment', updatedEquipment);
            return { success: true, data: updatedEquipment };
        } catch (error) {
            console.error('Error updating equipment:', error);
            return { success: false, error: error.message };
        }
    };

    const getAllEquipment = () => {
        return equipment;
    };

    const getEquipment = (equipmentId) => {
        const foundEquipment = equipment.find(item => item.id === equipmentId);
        return foundEquipment || null;
    };

    const getEquipmentByStatus = (status) => {
        return equipment.filter(item => item.status === status);
    };

    const getEquipmentByCategory = (category) => {
        return equipment.filter(item => item.category === category);
    };
    
    return (
        <EquipmentContext.Provider value={{ 
            equipment,
            addEquipment, 
            removeEquipment, 
            updateEquipment,
            getAllEquipment,
            getEquipment,
            getEquipmentByStatus,
            getEquipmentByCategory
        }}>
            {children}
        </EquipmentContext.Provider>
    );
};

export const useEquipment = () => {
    const context = useContext(EquipmentContext);
    if (!context) {
        throw new Error('useEquipment must be used within an EquipmentProvider');
    }
    return context;
};
