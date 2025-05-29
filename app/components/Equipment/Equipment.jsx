import {useState, useMemo} from 'react';
import { useEquipment } from '../../contexts/EquipmentContext.jsx';


const EquipmentList = () => {
    const { getAllEquipment } = useEquipment();

    const allEquipment  = getAllEquipment();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [conditionFilter, setConditionFilter] = useState('');

    const uniqueStatuses = [...new Set(allEquipment.map(item => item.status))];
    const uniqueCategories = [...new Set(allEquipment.map(item => item.category))];
    const uniqueConditions = [...new Set(allEquipment.map(item => item.condition))];

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

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'Available':
                return 'bg-green-100 text-green-800'
            case 'Rented':
                return 'bg-blue-100 text-blue-800';
            case 'Out of service':
                return 'bg-red-100 text-red-800';
            case 'Under Maintenance':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    const getConditionStyles = (condition) => {
        switch (condition.toLowerCase()) {
            case 'Excellent':
                return 'bg-green-100 text-green-800';
            case 'Good':
                return 'bg-blue-100 text-blue-800';
            case 'Fair':
                return 'bg-yellow-100 text-yellow-800';
            case 'Poor':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto dark:bg-gray-900 min-h-screen ">
            <div className="flex justify-between items-center mb-6 ">
                <div className="text-sm text-gray-600 ">
                    Showing {filteredEquipment.length} of {allEquipment.length} equipment
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6 dark:bg-gray-700">
                <div className="mb-4 ">
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
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {filteredEquipment.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No equipment found matching your criteria.</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-400">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">
                                        Condition
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-800 uppercase tracking-wider">
                                        Actions
                                    </th>
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
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full dark:bg-gray-600 dark:text-gray-200 ${getConditionStyles(equipment.condition)}`}>
                                                {equipment.condition}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full dark:bg-gray-600 dark:text-gray-200 ${getStatusStyles(equipment.status)}`}>
                                                {equipment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                                View
                                            </button>
                                            <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200">
                                                Edit
                                            </button>
                                            <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200">
                                                Delete
                                            </button>
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

export default EquipmentList;