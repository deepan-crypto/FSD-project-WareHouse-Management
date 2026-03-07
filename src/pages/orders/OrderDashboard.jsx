import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './OrderDashboard.css';

const OrderDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock data
    const orders = [
        { id: 'ORD-001', customer: 'ABC Corporation', status: 'picking', priority: 'high', items: 5, value: 1250.00, date: '2026-02-17' },
        { id: 'ORD-002', customer: 'XYZ Ltd', status: 'packing', priority: 'medium', items: 3, value: 850.00, date: '2026-02-17' },
        { id: 'ORD-003', customer: 'Tech Solutions', status: 'ready', priority: 'urgent', items: 8, value: 2100.00, date: '2026-02-17' },
        { id: 'ORD-004', customer: 'Global Traders', status: 'pending', priority: 'low', items: 2, value: 450.00, date: '2026-02-16' },
        { id: 'ORD-005', customer: 'Innovation Inc', status: 'allocated', priority: 'high', items: 6, value: 1800.00, date: '2026-02-16' },
        { id: 'ORD-006', customer: 'Market Leaders', status: 'dispatched', priority: 'medium', items: 4, value: 1100.00, date: '2026-02-15' },
    ];

    const getStatusBadgeVariant = (status) => {
        const variants = {
            'picking': 'purple',
            'packing': 'pink',
            'ready': 'success',
            'dispatched': 'solid-success',
            'pending': 'warning',
            'allocated': 'info',
            'cancelled': 'danger'
        };
        return variants[status] || 'default';
    };

    const getPriorityBadgeVariant = (priority) => {
        const variants = {
            'urgent': 'solid-danger',
            'high': 'orange',
            'medium': 'warning',
            'low': 'success'
        };
        return variants[priority] || 'default';
    };

    return (
        <div className="order-dashboard">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Order Management</h1>
                    <p className="page-subtitle">Manage and track all customer orders</p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={18} />}>
                    Create Order
                </Button>
            </div>

            <Card className="filter-card">
                <div className="filter-container">
                    <div className="search-wrapper">
                        <Input
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search size={18} />}
                        />
                    </div>
                    <div className="filter-controls">
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="allocated">Allocated</option>
                            <option value="picking">Picking</option>
                            <option value="packing">Packing</option>
                            <option value="ready">Ready</option>
                            <option value="dispatched">Dispatched</option>
                        </select>
                        <Button variant="secondary" leftIcon={<Filter size={18} />}>
                            More Filters
                        </Button>
                    </div>
                </div>
            </Card>

            <Card title="All Orders">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Items</th>
                                <th>Value</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
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
                                    <td className="order-value">${order.value.toFixed(2)}</td>
                                    <td>{order.date}</td>
                                    <td>
                                        <Button size="sm" variant="ghost">View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default OrderDashboard;
