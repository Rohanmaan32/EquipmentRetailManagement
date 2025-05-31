import { useState, useMemo } from 'react';
import { useMaintenance } from '../../contexts/MaintenanceContext.jsx';
import { useEquipment } from '../../contexts/EquipmentContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const MaintenanceList = () => {
    const { getAllMaintenanceRecords, addMaintenanceRecord, updateMaintenanceRecord } = useMaintenance();
    const { getAllEquipment } = useEquipment();
    const { user } = useAuth();
    
    const allRecords = getAllMaintenanceRecords();
    const allEquipment = getAllEquipment();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRecord, setNewRecord] = useState({
        equipmentId: '',
        date: '',
        type: '',
        notes: '',
        status: 'Scheduled'
    });

    const uniqueStatuses = [...new Set(allRecords.map(record => record.status))];
    const uniqueTypes = [...new Set(allRecords.map(record => record.type))];

    const filteredRecords = useMemo(() => {
        return allRecords.filter(record => {
            const equipment = allEquipment.find(eq => eq.id === record.equipmentId);
            const equipmentName = equipment ? equipment.name : '';
            
            const matchesSearch = record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                record.notes.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !statusFilter || record.status === statusFilter;
            const matchesType = !typeFilter || record.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [allRecords, allEquipment, searchTerm, statusFilter, typeFilter]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setTypeFilter('');
    };

    const handleAddRecord = (e) => {
        e.preventDefault();
        const newId = `m${allRecords.length + 1}`;
        const recordToAdd = { id: newId, ...newRecord };
        
        const result = addMaintenanceRecord(recordToAdd);
        if (result.success) {
            setNewRecord({ equipmentId: '', date: '', type: '', notes: '', status: 'Scheduled' });
            setShowAddForm(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'in progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'completed':
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
                    <p className="text-gray-600 dark:text-gray-400">Please log in to view maintenance records.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white dark:bg-gray-900 p-6 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Records</h2>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {filteredRecords.length} of {allRecords.length} records
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by ID, equipment, or notes..."
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
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[150px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    >
                        <option value="">All Types</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
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
                            New Record
                        </button>
                    )}
                </div>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add Maintenance Record</h3>
                        <form onSubmit={handleAddRecord}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Equipment</label>
                                    <select
                                        required
                                        value={newRecord.equipmentId}
                                        onChange={(e) => setNewRecord({...newRecord, equipmentId: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Equipment</option>
                                        {allEquipment.map(equipment => (
                                            <option key={equipment.id} value={equipment.id}>
                                                {equipment.name} ({equipment.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newRecord.date}
                                        onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select
                                        required
                                        value={newRecord.type}
                                        onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Routine Inspection">Routine Inspection</option>
                                        <option value="Preventive Maintenance">Preventive Maintenance</option>
                                        <option value="Repair">Repair</option>
                                        <option value="Scheduled Service">Scheduled Service</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                                    <textarea
                                        required
                                        value={newRecord.notes}
                                        onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Record
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
                {filteredRecords.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 dark:text-gray-400 text-lg">No maintenance records found matching your criteria.</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Equipment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
                                {filteredRecords.map(record => (
                                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">
                                            {record.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {getEquipmentName(record.equipmentId)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {record.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {record.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(record.status)} transition-colors`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                                            {record.notes}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                                View
                                            </button>
                                            {canEdit && (
                                                <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200">
                                                    Edit
                                                </button>
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

export default MaintenanceList;
