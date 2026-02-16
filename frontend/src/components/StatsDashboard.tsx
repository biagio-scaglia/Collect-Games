import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCollection } from '../hooks/useCollection';
import styles from '../App.module.css';

const COLORS = ['#7B5FA6', '#9B7FC6', '#BB9FE6', '#DBBFFF', '#FBD9FF'];

export function StatsDashboard() {
    const { data: collection } = useCollection();

    if (!collection || collection.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No data available for statistics</p>
            </div>
        );
    }

    // Games per console
    const consoleData = collection.reduce((acc: Record<string, number>, item) => {
        const platform = item.game?.platform || 'Unknown';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.entries(consoleData).map(([name, value]) => ({
        name,
        value,
    }));

    // Condition distribution
    const conditionData = collection.reduce((acc: Record<string, number>, item) => {
        acc[item.condition] = (acc[item.condition] || 0) + 1;
        return acc;
    }, {});

    const barData = Object.entries(conditionData).map(([name, value]) => ({
        name,
        count: value,
    }));

    // Total spending
    const totalSpent = collection.reduce((sum, item) => sum + (item.pricePaid || 0), 0);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#7B5FA6', marginBottom: '20px' }}>Collection Statistics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '8px', border: '2px solid #7B5FA6' }}>
                    <h3 style={{ color: '#9B7FC6' }}>Total Games</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{collection.length}</p>
                </div>
                <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '8px', border: '2px solid #7B5FA6' }}>
                    <h3 style={{ color: '#9B7FC6' }}>Total Spent</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>€{totalSpent.toFixed(2)}</p>
                </div>
                <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '8px', border: '2px solid #7B5FA6' }}>
                    <h3 style={{ color: '#9B7FC6' }}>Avg. Price</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>€{(totalSpent / collection.length).toFixed(2)}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '8px', border: '2px solid #7B5FA6' }}>
                    <h3 style={{ color: '#9B7FC6', marginBottom: '15px' }}>Games per Console</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '8px', border: '2px solid #7B5FA6' }}>
                    <h3 style={{ color: '#9B7FC6', marginBottom: '15px' }}>Condition Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#9B7FC6" />
                            <YAxis stroke="#9B7FC6" />
                            <Tooltip contentStyle={{ background: '#2a2a3e', border: '1px solid #7B5FA6' }} />
                            <Legend />
                            <Bar dataKey="count" fill="#7B5FA6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
