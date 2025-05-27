import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EquipmentProvider } from './contexts/EquipmentContext';
import { RentalsProvider } from './contexts/RentalsContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EquipmentPage from './pages/EquipmentPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import RentalsPage from './pages/RentalsPage';
import MaintenancePage from './pages/MaintenancePage';

import {saveToLocalStorage} from './localStorageUtils';


const App = () => {
    
    return (
        <AuthProvider>
            <EquipmentProvider>
                <RentalsProvider>
                    <MaintenanceProvider>
                        <Router>
                            <Switch>
                                <Route path="/" exact component={LoginPage} />
                                <Route path="/dashboard" component={DashboardPage} />
                                <Route path="/equipment" exact component={EquipmentPage} />
                                <Route path="/equipment/:id" component={EquipmentDetailPage} />
                                <Route path="/rentals" component={RentalsPage} />
                                <Route path="/maintenance" component={MaintenancePage} />
                            </Switch>
                        </Router>
                    </MaintenanceProvider>
                </RentalsProvider>
            </EquipmentProvider>
        </AuthProvider>
    );
};
const test = () => {
    return(
        <AuthProvider>

        </AuthProvider>
    )
}
export default App;