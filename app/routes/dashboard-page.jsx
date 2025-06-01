import KPICard from '../components/Dashboard/KPICard';
import EquipmentStatusChart from '../components/Dashboard/EquipmentStatusChart';
import RentalsByStatusChart from '../components/Dashboard/RentalsByStatusChart';
import MonthlyRentalTrendsChart from '../components/Dashboard/MonthlyRentalTrendsChart';
import { useEquipment } from '../contexts/EquipmentContext';
import { useRental } from '../contexts/RentalContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { useAuth } from '../contexts/AuthContext';
import { useMemo } from 'react';
import Topbar from '../components/Home/TopBar';
import ProtectedRoute from '../components/Authentication/ProtectedRoute';

const exportToCSV = (data, filename = 'export.csv') => {
    const csvContent = data.map(row => 
        Object.values(row).map(value => 
            typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value
        ).join(',')
    ).join('\n');
    
    const headers = Object.keys(data[0]).join(',');
    const fullContent = headers + '\n' + csvContent;
    
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const exportToJSON = (data, filename = 'export.json') => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const UserGroupIcon = () => <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const CheckBadgeIcon = () => <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>;
const ClockAlertIcon = () => <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const WrenchScrewdriverIcon = () => <svg className="w-8 h-8 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>;

export default function DashboardPage() {
    const { user } = useAuth();
    const { getAllEquipment } = useEquipment();
    const { getAllRentals } = useRental();
    const { getAllMaintenanceRecords } = useMaintenance();

    const equipment = getAllEquipment();
    const rentals = getAllRentals();
    const maintenanceRecords = getAllMaintenanceRecords();

    const kpis = useMemo(() => {
        const totalEquipment = equipment.length;
        const availableEquipment = equipment.filter(eq => eq.status.toLowerCase() === 'available').length;
        const rentedEquipmentCount = equipment.filter(eq => eq.status.toLowerCase() === 'rented').length;

        const today = new Date();
        today.setHours(0,0,0,0); 

        const overdueRentals = rentals.filter(r => 
            r.status.toLowerCase() === 'rented' && new Date(r.endDate) < today
        ).length;

        const upcomingMaintenance = maintenanceRecords.filter(m => {
            const maintenanceDate = new Date(m.date);
            const diffTime = maintenanceDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return (m.status.toLowerCase() === 'scheduled' || m.status.toLowerCase() === 'in progress') && diffDays >= 0 && diffDays <= 7;
        }).length;

        return {
            totalEquipment,
            availableEquipment,
            rentedEquipmentCount,
            overdueRentals,
            upcomingMaintenance,
        };
    }, [equipment, rentals, maintenanceRecords]);

    const handleExportKPI = (type, kpiType) => {
        let data = [];
        let filename = '';

        switch (kpiType) {
            case 'equipment':
                data = equipment.map(eq => ({
                    ID: eq.id,
                    Name: eq.name,
                    Category: eq.category,
                    Condition: eq.condition,
                    Status: eq.status
                }));
                filename = `equipment-data.${type}`;
                break;
            case 'rentals':
                data = rentals.map(rental => ({
                    ID: rental.id,
                    'Equipment ID': rental.equipmentId,
                    'Customer ID': rental.customerId,
                    'Start Date': rental.startDate,
                    'End Date': rental.endDate,
                    Status: rental.status
                }));
                filename = `rentals-data.${type}`;
                break;
            case 'maintenance':
                data = maintenanceRecords.map(record => ({
                    ID: record.id,
                    'Equipment ID': record.equipmentId,
                    Date: record.date,
                    Type: record.type,
                    Status: record.status,
                    Notes: record.notes
                }));
                filename = `maintenance-data.${type}`;
                break;
            case 'summary':
                data = [{
                    'Total Equipment': kpis.totalEquipment,
                    'Available Equipment': kpis.availableEquipment,
                    'Rented Equipment': kpis.rentedEquipmentCount,
                    'Overdue Rentals': kpis.overdueRentals,
                    'Upcoming Maintenance': kpis.upcomingMaintenance,
                    'Generated Date': new Date().toISOString().split('T')[0]
                }];
                filename = `kpi-summary.${type}`;
                break;
        }

        if (type === 'csv') {
            exportToCSV(data, filename);
        } else {
            exportToJSON(data, filename);
        }
    };

    const handleExportAll = (type) => {
        const allData = {
            summary: {
                totalEquipment: kpis.totalEquipment,
                availableEquipment: kpis.availableEquipment,
                rentedEquipmentCount: kpis.rentedEquipmentCount,
                overdueRentals: kpis.overdueRentals,
                upcomingMaintenance: kpis.upcomingMaintenance,
                generatedDate: new Date().toISOString()
            },
            equipment: equipment,
            rentals: rentals,
            maintenance: maintenanceRecords
        };

        if (type === 'csv') {
            exportToCSV([allData.summary], 'dashboard-summary.csv');
        } else {
            exportToJSON(allData, 'dashboard-complete.json');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen w-full bg-white dark:bg-gray-900 flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please log in to view the dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ProtectedRoute requiredRoles={["view"]} />
            <Topbar />
            
            <div className="pt-16 min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleExportAll('csv')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Export CSV
                        </button>
                        <button
                            onClick={() => handleExportAll('json')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Export JSON
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard 
                        title="Total Equipment" 
                        value={kpis.totalEquipment} 
                        icon={<UserGroupIcon />} 
                        exportData={(type) => handleExportKPI(type, 'equipment')}
                    />
                    <KPICard 
                        title="Available Equipment" 
                        value={kpis.availableEquipment} 
                        icon={<CheckBadgeIcon />} 
                        color="green" 
                        exportData={(type) => handleExportKPI(type, 'equipment')}
                    />
                    <KPICard 
                        title="Overdue Rentals" 
                        value={kpis.overdueRentals} 
                        icon={<ClockAlertIcon />} 
                        color="red" 
                        exportData={(type) => handleExportKPI(type, 'rentals')}
                    />
                    <KPICard 
                        title="Upcoming Maintenance (7 days)" 
                        value={kpis.upcomingMaintenance} 
                        icon={<WrenchScrewdriverIcon />} 
                        color="yellow" 
                        exportData={(type) => handleExportKPI(type, 'maintenance')}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Equipment Status</h2>
                        <EquipmentStatusChart 
                            available={kpis.availableEquipment} 
                            rented={kpis.rentedEquipmentCount}
                            maintenance={equipment.filter(eq => eq.status.toLowerCase() === 'under maintenance').length}
                            outOfService={equipment.filter(eq => eq.status.toLowerCase() === 'out of service').length}
                        />
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Rentals by Status</h2>
                        <RentalsByStatusChart rentals={rentals} />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 lg:col-span-2"> 
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monthly Rental Trends (Last 6 Months)</h2>
                        <MonthlyRentalTrendsChart rentals={rentals} />
                    </div>
                </div>
            </div>
        </>
    );
}
