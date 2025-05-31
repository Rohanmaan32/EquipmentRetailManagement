import KPICard from '../components/dashboard/KPICard';
import EquipmentStatusChart from '../components/dashboard/EquipmentStatusChart';
import { useEquipment } from '../contexts/EquipmentContext';
import { useRental } from '../contexts/RentalContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { useAuth } from '../contexts/AuthContext';
import { useMemo } from 'react';
// some complicated svg stuff. no idea how this works but it does
const UserGroupIcon = () => <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const CheckBadgeIcon = () => <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>;
const ClockAlertIcon = () => <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>;
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
            return (m.status.toLowerCase() === 'scheduled' || m.status.toLowerCase() === 'in progress') && diffDays >= 0 && diffDays <= 7; // Upcoming in next 7 days
        }).length;

        return {
            totalEquipment,
            availableEquipment,
            rentedEquipmentCount,
            overdueRentals,
            upcomingMaintenance,
        };
    }, [equipment, rentals, maintenanceRecords]);

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
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard title="Total Equipment" value={kpis.totalEquipment} icon={<UserGroupIcon />} />
                <KPICard title="Available Equipment" value={kpis.availableEquipment} icon={<CheckBadgeIcon />} color="green" />
                <KPICard title="Overdue Rentals" value={kpis.overdueRentals} icon={<ClockAlertIcon />} color="red" />
                <KPICard title="Upcoming Maintenance (7 days)" value={kpis.upcomingMaintenance} icon={<WrenchScrewdriverIcon />} color="yellow" />
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
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Rental Overview (Placeholder)</h2>
                    <p className="text-gray-600 dark:text-gray-400">More rental charts coming soon...</p>
                </div>
            </div>
        </div>
    );
}
