
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDarkMode } from '../../contexts/DarkmodeContext'; 

const EquipmentStatusChart = ({ available, rented, maintenance, outOfService }) => {
    const { isDarkMode } = useDarkMode(); 

    const data = [
        { name: 'Available', value: available },
        { name: 'Rented', value: rented },
        { name: 'Maintenance', value: maintenance },
        { name: 'Out of Service', value: outOfService },
    ];

    const COLORS_LIGHT = ['#4CAF50', '#2196F3', '#FFC107', '#F44336']; 
    const COLORS_DARK = ['#66BB6A', '#42A5F5', '#FFCA28', '#EF5350']; 

    const COLORS = isDarkMode ? COLORS_DARK : COLORS_LIGHT;

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent * 100 < 5) return null; 

        return (
            <text x={x} y={y} fill={isDarkMode ? "white" : "black"} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };


    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ 
                            backgroundColor: isDarkMode ? 'rgb(31 41 55)' : 'white', // gray-800 or white
                            borderColor: isDarkMode ? 'rgb(55 65 81)' : 'rgb(229 231 235)', // gray-700 or gray-200
                            color: isDarkMode ? 'white' : 'black'
                        }}
                    />
                    <Legend wrapperStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EquipmentStatusChart;
