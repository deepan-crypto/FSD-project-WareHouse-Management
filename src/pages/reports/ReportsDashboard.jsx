import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { ToastContainer } from '../../components/common/Toast';
import { Download } from 'lucide-react';
import '../orders/OrderDashboard.css';
import './ReportsDashboard.css';

const ReportsDashboard = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const productivityData = [
        { name: 'John Doe', orders: 145, accuracy: 98.5 },
        { name: 'Jane Smith', orders: 132, accuracy: 97.2 },
        { name: 'Mike Johnson', orders: 128, accuracy: 99.1 },
        { name: 'Sarah Lee', orders: 118, accuracy: 96.8 },
        { name: 'Tom Brown', orders: 95, accuracy: 98.0 },
    ];

    const weeklyOrders = [
        { day: 'Mon', completed: 85, delayed: 3 },
        { day: 'Tue', completed: 92, delayed: 5 },
        { day: 'Wed', completed: 78, delayed: 2 },
        { day: 'Thu', completed: 95, delayed: 4 },
        { day: 'Fri', completed: 88, delayed: 1 },
        { day: 'Sat', completed: 45, delayed: 2 },
        { day: 'Sun', completed: 32, delayed: 1 },
    ];

    const statusDistribution = [
        { name: 'Pending', value: 45 },
        { name: 'In Progress', value: 128 },
        { name: 'Completed', value: 1180 },
        { name: 'Cancelled', value: 18 },
    ];

    const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

    const handleExportReports = () => {
        const headers = ['Staff Member', 'Orders Completed', 'Accuracy Rate'];
        const rows = productivityData.map((staff) => [
            staff.name,
            staff.orders,
            `${staff.accuracy}%`
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `warehouse-report-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addToast('Report exported as CSV.', 'success');
    };

    return (
        <div className="reports-dashboard">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Performance insights and metrics</p>
                </div>
                <Button variant="primary" leftIcon={<Download size={18} />} onClick={handleExportReports}>
                    Export Reports
                </Button>
            </div>

            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-details">
                            <p className="stat-label">Avg Fulfillment Time</p>
                            <h3 className="stat-value">4.5h</h3>
                            <Badge variant="success" size="sm">-8% vs last week</Badge>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-details">
                            <p className="stat-label">Error Rate</p>
                            <h3 className="stat-value">1.2%</h3>
                            <Badge variant="warning" size="sm">+0.3% vs last week</Badge>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-details">
                            <p className="stat-label">On-Time Delivery</p>
                            <h3 className="stat-value">96.5%</h3>
                            <Badge variant="success" size="sm">+2.1% vs last week</Badge>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="reports-grid">
                <Card title="Weekly Order Performance" className="chart-card">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyOrders}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completed" fill="#10b981" name="Completed" />
                            <Bar dataKey="delayed" fill="#ef4444" name="Delayed" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Order Status Distribution" className="chart-card">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card title="Staff Productivity (Top 5)">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Staff Member</th>
                                <th>Orders Completed</th>
                                <th>Accuracy Rate</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productivityData.map((staff, index) => (
                                <tr key={index}>
                                    <td>{staff.name}</td>
                                    <td>{staff.orders}</td>
                                    <td>{staff.accuracy}%</td>
                                    <td>
                                        <Badge variant={staff.accuracy >= 98 ? 'success' : 'warning'} size="sm">
                                            {staff.accuracy >= 98 ? 'Excellent' : 'Good'}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default ReportsDashboard;
