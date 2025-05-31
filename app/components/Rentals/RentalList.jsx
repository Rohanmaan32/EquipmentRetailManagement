import { useState, useMemo } from 'react';
import { useRental } from '../../contexts/RentalContext.jsx';
import { useEquipment } from '../../contexts/EquipmentContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const RentalList = () => {
    const { getAllRentals, addRental, updateRental } = useRental();
    const { getAllEquipment } = useEquipment();
    const { user } = useAuth();
    
    const allRentals = getAllRentals();
    const allEquipment = getAllEquipment();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [customerFilter, setCustomerFilter] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRental, setNewRental] = useState({
        equipmentId: '',
        customerId: '',
        startDate: '',
        endDate: '',
        status: 'Reserved'
    });

    const uniqueStatuses = [...new Set(allRentals.map(rental => rental.status))];
    const uniqueCustomers = [...new Set(allRentals.map(rental => rental.customerId))];

    const filteredRentals = useMemo(() => {
        return allRentals.filter(rental => {
            const equipment = allEquipment.find(eq => eq.id === rental.equipmentId);
            const equipmentName = equipment ? equipment.name : '';
            
            const matchesSearch = rental.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                rental.customerId.includes(searchTerm);
            const matchesStatus = !statusFilter || rental.status === statusFilter;
            const matchesCustomer = !customerFilter || rental.customerId === customerFilter;

            return matchesSearch && matchesStatus && matchesCustomer;
        });
    }, [allRentals, allEquipment, searchTerm, statusFilter, customerFilter]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setCustomerFilter('');
    };

    const handleAddRental = (e) => {
        e.preventDefault();
        const newId = `r${allRentals.length + 1}`;
        const rentalToAdd = { id: newId, ...newRental };
        
        const result = addRental(rentalToAdd);
        if (result.success) {
            setNewRental({ equipmentId: '', customerId: '', startDate: '', endDate: '', status: 'Reserved' });
            setShowAddForm(false);
        }
    };

    const handleStatusUpdate = (rentalId, newStatus) => {
        updateRental(rentalId, { status: newStatus });
    };

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'reserved':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'rented':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'returned':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const getEquipmentName = (equipmentId) => {
        const equipment = allEquipment.find(eq => eq.id === equipmentId);
        return equipment ? equipment.name : 'Unknown Equipment';
    };

    const userRoles = user?.roles || [];
    const canCreate = userRoles.includes('create');
    const canEdit = userRoles.includes('edit');

    if (!user) {
        return (
            <div className="min-h-screen w-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please log in to view rentals.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white dark:bg-gray-900 p-6 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rental Management</h2>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {filteredRentals.length} of {allRentals.length} rentals
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by rental ID, equipment, or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[150px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    >
                        <option value="">All Statuses</option>
                        {uniqueStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <select
                        value={customerFilter}
                        onChange={(e) => setCustomerFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[150px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    >
                        <option value="">All Customers</option>
                        {uniqueCustomers.map(customer => (
                            <option key={customer} value={customer}>Customer {customer}</option>
                        ))}
                    </select>

                    <button 
                        onClick={clearFilters} 
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        Clear Filters
                    </button>

                    {canCreate && (
                        <button 
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            New Rental
                        </button>
                    )}
                </div>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Create New Rental</h3>
                        <form onSubmit={handleAddRental}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Equipment</label>
                                    <select
                                        required
                                        value={newRental.equipmentId}
                                        onChange={(e) => setNewRental({...newRental, equipmentId: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Equipment</option>
                                        {allEquipment.filter(eq => eq.status === 'Available').map(equipment => (
                                            <option key={equipment.id} value={equipment.id}>
                                                {equipment.name} ({equipment.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={newRental.customerId}
                                        onChange={(e) => setNewRental({...newRental, customerId: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newRental.startDate}
                                        onChange={(e) => setNewRental({...newRental, startDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newRental.endDate}
                                        onChange={(e) => setNewRental({...newRental, endDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Rental
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                {filteredRentals.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 dark:text-gray-400 text-lg">No rentals found matching your criteria.</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Equipment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
                                {filteredRentals.map(rental => (
                                    <tr key={rental.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">
                                            {rental.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {getEquipmentName(rental.equipmentId)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            Customer {rental.customerId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {rental.startDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {rental.endDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(rental.status)} transition-colors`}>
                                                {rental.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                                View
                                            </button>
                                            {canEdit && (
                                                <>
                                                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200">
                                                        Edit
                                                    </button>
                                                    <select
                                                        value={rental.status}
                                                        onChange={(e) => handleStatusUpdate(rental.id, e.target.value)}
                                                        className="inline-flex px-2 py-1 text-xs border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    >
                                                        <option value="Reserved">Reserved</option>
                                                        <option value="Rented">Rented</option>
                                                        <option value="Returned">Returned</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RentalList;
