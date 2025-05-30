import {useState, useMemo} from 'react';
import { useEquipment } from '../../contexts/EquipmentContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const EquipmentList = () => {
    const { getAllEquipment, addEquipment } = useEquipment();
    const { user } = useAuth();
    
    const allEquipment = getAllEquipment();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [conditionFilter, setConditionFilter] = useState('');
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEquipment, setNewEquipment] = useState({
        name: '',
        category: '',
        condition: '',
        status: ''
    });

    const uniqueStatuses = [...new Set(allEquipment.map(item => item.status))];
    const uniqueCategories = [...new Set(allEquipment.map(item => item.category))];
    const uniqueConditions = [...new Set(allEquipment.map(item => item.condition))];

    console.log('User:', user);
    console.log('User roles:', user?.roles);

    const filteredEquipment = useMemo(() => {
        return allEquipment.filter(equipment => {
            const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                equipment.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !statusFilter || equipment.status === statusFilter;
            const matchesCategory = !categoryFilter || equipment.category === categoryFilter;
            const matchesCondition = !conditionFilter || equipment.condition === conditionFilter;

            return matchesSearch && matchesStatus && matchesCategory && matchesCondition;
        });
    }, [allEquipment, searchTerm, statusFilter, categoryFilter, conditionFilter]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setCategoryFilter('');
        setConditionFilter('');
    };

    const handleAddEquipment = (e) => {
        e.preventDefault();
        
        const newId = `eq${allEquipment.length + 1}`;
        
        const equipmentToAdd = {
            id: newId,
            ...newEquipment
        };
        
        const result = addEquipment(equipmentToAdd);
        
        if (result.success) {
            setNewEquipment({ name: '', category: '', condition: '', status: '' });
            setShowAddForm(false);
        } else {
            alert('Error adding equipment: ' + result.error);
        }
    };

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'available':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'rented':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'out of service':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'under maintenance':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const getConditionStyles = (condition) => {
        switch (condition.toLowerCase()) {
            case 'excellent':
                return 'bg-emerald-200 text-emerald-800 dark:bg-green-900 dark:text-emerald-200';
            case 'good':
                return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200';
            case 'fair':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'poor':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const userRoles = user?.roles || [];
    const canView = userRoles.includes('view');
    const canEdit = userRoles.includes('edit');
    const canDelete = userRoles.includes('delete');
    const canCreate = userRoles.includes('create');

    return (
        <div className="p-6 max-w-full mx-auto dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {filteredEquipment.length} of {allEquipment.length} equipment
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6 dark:bg-gray-700">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md dark:bg-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border dark:bg-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[150px]"
                    >
                        <option value="">All Statuses</option>
                        {uniqueStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border dark:bg-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[150px]"
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <select
                        value={conditionFilter}
                        onChange={(e) => setConditionFilter(e.target.value)}
                        className="px-3 py-2 border dark:bg-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[150px]"
                    >
                        <option value="">All Conditions</option>
                        {uniqueConditions.map(condition => (
                            <option key={condition} value={condition}>{condition}</option>
                        ))}
                    </select>

                    <button 
                        onClick={clearFilters} 
                        className="px-4 py-2 bg-gray-600 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
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
                            Add Equipment
                        </button>
                    )}
                </div>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Equipment</h3>
                        <form onSubmit={handleAddEquipment}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEquipment.name}
                                        onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <select
                                        required
                                        value={newEquipment.category}
                                        onChange={(e) => setNewEquipment({...newEquipment, category: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Category</option>
                                        {uniqueCategories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition</label>
                                    <select
                                        required
                                        value={newEquipment.condition}
                                        onChange={(e) => setNewEquipment({...newEquipment, condition: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Condition</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <select
                                        required
                                        value={newEquipment.status}
                                        onChange={(e) => setNewEquipment({...newEquipment, status: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Available">Available</option>
                                        <option value="Rented">Rented</option>
                                        <option value="Under Maintenance">Under Maintenance</option>
                                        <option value="Out of Service">Out of Service</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Equipment
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

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {filteredEquipment.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 dark:text-gray-400 text-lg">No equipment found matching your criteria.</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-400">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">Condition</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-400">
                                {filteredEquipment.map(equipment => (
                                    <tr key={equipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                                            {equipment.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {equipment.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {equipment.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionStyles(equipment.condition)}`}>
                                                {equipment.condition}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(equipment.status)}`}>
                                                {equipment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            {canView && (
                                                <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                                    View
                                                </button>
                                            )}
                                            {canEdit && (
                                                <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200">
                                                    Edit
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200">
                                                    Delete
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

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Logged in as: {user?.role} | Permissions: {userRoles.join(', ')} | Can create: {canCreate.toString()}
            </div>
        </div>
    );
};

export default EquipmentList;
