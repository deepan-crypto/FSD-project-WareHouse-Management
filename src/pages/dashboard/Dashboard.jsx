import React from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, AlertCircle, Users, Clock, CheckCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import './Dashboard.css';

const Dashboard = () => {
    // Mock data
    const stats = [
        {
            title: 'Total Orders',
            value: '1,284',
            change: '+12.5%',
            trend: 'up',
            icon: Package,
            color: 'primary'
        },
        {
            title: 'Pending Orders',
            value: '45',
            change: '-8%',
            trend: 'down',
            icon: Clock,
            color: 'warning'
        },
        {
            title: 'Completed Today',
            value: '128',
            change: '+15%',
            trend: 'up',
            icon: CheckCircle,
            color: 'success'
        },
        {
            title: 'Active Staff',
            value: '24',
            change: '+2',
            trend: 'up',
            icon: Users,
            color: 'info'
        }
    ];

    const recentOrders = [
        { id: 'ORD-001', customer: 'ABC Corp', status: 'picking', priority: 'high', items: 5 },
        { id: 'ORD-002', customer: 'XYZ Ltd', status: 'packing', priority: 'medium', items: 3 },
        { id: 'ORD-003', customer: 'Tech Solutions', status: 'ready', priority: 'urgent', items: 8 },
        { id: 'ORD-004', customer: 'Global Traders', status: 'picking', priority: 'low', items: 2 },
    ];

    const lowStockAlerts = [
        { sku: 'PROD-001', name: 'Widget A', stock: 12, reorderLevel: 50 },
        { sku: 'PROD-015', name: 'Component B', stock: 5, reorderLevel: 20 },
        { sku: 'PROD-023', name: 'Part C', stock: 8, reorderLevel: 30 },
    ];

    const getStatusBadgeVariant = (status) => {
        const variants = {
            'picking': 'purple',
            'packing': 'pink',
            'ready': 'success',
            'dispatched': 'success',
            'pending': 'warning',
            'cancelled': 'danger'
        };
        return variants[status] || 'default';
    };

    const getPriorityBadgeVariant = (priority) => {
        const variants = {
            'urgent': 'danger',
            'high': 'orange',
            'medium': 'warning',
            'low': 'success'
        };
        return variants[priority] || 'default';
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard Overview</h1>
                <p className="dashboard-subtitle">Welcome back! Here's what's happening in your warehouse today.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className="stat-card">
                        <div className="stat-content">
                            <div className={`stat-icon stat-icon-${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="stat-details">
                                <p className="stat-label">{stat.title}</p>
                                <h3 className="stat-value">{stat.value}</h3>
                                <div className={`stat-change stat-change-${stat.trend}`}>
                                    <TrendingUp size={14} />
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Recent Orders */}
                <Card
                    title="Recent Orders"
                    headerAction={<Link to="/orders" className="card-link">View all</Link>}
                    className="dashboard-card"
                >
                    <div className="table-responsive">
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="order-id">{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>
                                            <Badge variant={getStatusBadgeVariant(order.status)} size="sm">
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge variant={getPriorityBadgeVariant(order.priority)} size="sm">
                                                {order.priority}
                                            </Badge>
                                        </td>
                                        <td>{order.items}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Low Stock Alerts */}
                <Card
                    title="Low Stock Alerts"
                    headerAction={<Link to="/inventory" className="card-link">View inventory</Link>}
                    className="dashboard-card"
                >
                    <div className="alert-list">
                        {lowStockAlerts.map((item) => (
                            <div key={item.sku} className="alert-item">
                                <div className="alert-icon">
                                    <AlertCircle size={20} />
                                </div>
                                <div className="alert-info">
                                    <p className="alert-name">{item.name}</p>
                                    <p className="alert-sku">{item.sku}</p>
                                </div>
                                <div className="alert-stock">
                                    <span className="alert-current">{item.stock}</span>
                                    <span className="alert-separator">/</span>
                                    <span className="alert-reorder">{item.reorderLevel}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card title="Quick Actions" className="quick-actions-card">
                <div className="quick-actions-grid">
                    <Link to="/orders" className="quick-action">
                        <Package size={24} />
                        <span>Manage Orders</span>
                    </Link>
                    <Link to="/inventory" className="quick-action">
                        <Package size={24} />
                        <span>Check Inventory</span>
                    </Link>
                    <Link to="/tracking" className="quick-action">
                        <CheckCircle size={24} />
                        <span>Track Orders</span>
                    </Link>
                    <Link to="/reports" className="quick-action">
                        <TrendingUp size={24} />
                        <span>View Reports</span>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
