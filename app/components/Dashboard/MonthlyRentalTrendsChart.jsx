import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useDarkMode } from '../../contexts/DarkmodeContext';

const MonthlyRentalTrendsChart = ({ rentals }) => {
    const { isDarkMode } = useDarkMode();

    const data = useMemo(() => {
        const monthlyCounts = {};
        const today = new Date();
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1); // go back 5 full months to get 6 months total

        rentals.forEach(rental => {
            const startDate = new Date(rental.startDate);
            if (startDate >= sixMonthsAgo) { //  last 6 months
                const monthYear = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM format
                monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
            }
        });
        
        const sortedMonths = Object.keys(monthlyCounts).sort();
        
        return sortedMonths.map(monthYear => {
            const [year, month] = monthYear.split('-');
            const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
            return { name: `${monthName} ${year.slice(-2)}`, count: monthlyCounts[monthYear] };
        });

    }, [rentals]);

    const lineColor = isDarkMode ? '#66BB6A' : '#4CAF50'; 

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4A5568' : '#E2E8F0'} />
                    <XAxis dataKey="name" tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568', fontSize: 12 }} />
                    <Tooltip
                        cursor={{ stroke: isDarkMode ? '#A0AEC0' : '#4A5568', strokeDasharray: '3 3' }}
                        contentStyle={{
                            backgroundColor: isDarkMode ? 'rgb(31 41 55)' : 'white',
                            borderColor: isDarkMode ? 'rgb(55 65 81)' : 'rgb(229 231 235)',
                            color: isDarkMode ? 'white' : 'black'
                        }}
                    />
                    <Legend wrapperStyle={{ color: isDarkMode ? 'white' : 'black', fontSize: 14 }} />
                    <Line type="monotone" dataKey="count" stroke={lineColor} strokeWidth={2} name="New Rentals" activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyRentalTrendsChart;
