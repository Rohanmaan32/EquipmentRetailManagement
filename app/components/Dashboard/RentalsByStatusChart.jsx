import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useDarkMode } from '../../contexts/DarkmodeContext'; 

const RentalsByStatusChart = ({ rentals }) => {
    const { isDarkMode } = useDarkMode(); 

    const data = useMemo(() => {
        const statusCounts = {
            Reserved: 0,
            Rented: 0,
            Returned: 0,
            Cancelled: 0,
        };

        if (Array.isArray(rentals)) {
            rentals.forEach(rental => { 
                if (rental && rental.status && statusCounts[rental.status] !== undefined) {
                    statusCounts[rental.status]++;
                }
            });
        }
        return Object.entries(statusCounts).map(([name, value]) => ({ name, count: value }));
    }, [rentals]);

    const barColor = isDarkMode ? '#42A5F5' : '#2196F3';

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4A5568' : '#E2E8F0'} />
                    <XAxis dataKey="name" tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568', fontSize: 12 }} />
                    <Tooltip
                        cursor={{ fill: isDarkMode ? 'rgba(74, 85, 104, 0.5)' : 'rgba(226, 232, 240, 0.5)' }}
                        contentStyle={{
                            backgroundColor: isDarkMode ? 'rgb(31 41 55)' : 'white', 
                            borderColor: isDarkMode ? 'rgb(55 65 81)' : 'rgb(229 231 235)', 
                            color: isDarkMode ? 'white' : 'black'
                        }}
                    />
                    <Legend wrapperStyle={{ color: isDarkMode ? 'white' : 'black', fontSize: 14 }} />
                    <Bar dataKey="count" fill={barColor} name="Number of Rentals" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RentalsByStatusChart;
