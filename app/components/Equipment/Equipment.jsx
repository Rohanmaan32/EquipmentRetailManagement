import {useState} from 'react';
import { useEquipment } from '../../contexts/EquipmentContext';

const { getallEquipment } = useEquipment;
export const DisplayEquipment = () => {
    return {getallEquipment};
}