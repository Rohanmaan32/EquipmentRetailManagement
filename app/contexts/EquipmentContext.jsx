import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../../utils/localStorageUtils.js'; 

const EquipmentContext = createContext();

export const EquipmentProvider = ({ children }) => {
    const equipment = [
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
    useEffect(() => {
        saveToLocalStorage('equipment',equipment);
      
    },[])

    const addEquipment = (newEquipment) => {
        equipment = getFromLocalStorage('equipment');
        equipment.push(newEquipment);
        saveToLocalStorage('equipment',equipment);
    };

    const removeEquipment = (equipmentId) => {
        equipment = getFromLocalStorage('equipment');
        const updatedEquipment = equipment.filter(item => item.id !== equipmentId);
        saveToLocalStorage('equipment',updatedEquipment);
    };

    const updateEquipment = (updatedEquipment) => {
    };

    return (
        <EquipmentContext.Provider value={{ equipment, addEquipment, removeEquipment, updateEquipment }}>
            {children}
        </EquipmentContext.Provider>
    );
};

export const useEquipment = () => {
    return useContext(EquipmentContext);
};