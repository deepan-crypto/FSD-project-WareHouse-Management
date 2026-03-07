import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { ToastContainer } from '../../components/common/Toast';
import './OrderDashboard.css';

const OrderDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [newOrder, setNewOrder] = useState({
        customer: '',
        priority: 'medium',
        items: 1,
        value: ''
    });

    const [orders, setOrders] = useState([
        { id: 'ORD-001', customer: 'ABC Corporation', status: 'picking', priority: 'high', items: 5, value: 1250.00, date: '2026-02-17' },
        { id: 'ORD-002', customer: 'XYZ Ltd', status: 'packing', priority: 'medium', items: 3, value: 850.00, date: '2026-02-17' },
        { id: 'ORD-003', customer: 'Tech Solutions', status: 'ready', priority: 'urgent', items: 8, value: 2100.00, date: '2026-02-17' },
        { id: 'ORD-004', customer: 'Global Traders', status: 'pending', priority: 'low', items: 2, value: 450.00, date: '2026-02-16' },
        { id: 'ORD-005', customer: 'Innovation Inc', status: 'allocated', priority: 'high', items: 6, value: 1800.00, date: '2026-02-16' },
        { id: 'ORD-006', customer: 'Market Leaders', status: 'dispatched', priority: 'medium', items: 4, value: 1100.00, date: '2026-02-15' },
    ]);

    const addToast = (message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

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

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreateOrder = () => {
        if (!newOrder.customer.trim() || !newOrder.value) {
            addToast('Please enter customer and order value.', 'warning');
            return;
        }

        const nextNumber = orders.length + 1;
        const createdOrder = {
            id: `ORD-${String(nextNumber).padStart(3, '0')}`,
            customer: newOrder.customer.trim(),
            status: 'pending',
            priority: newOrder.priority,
            items: Number(newOrder.items) || 1,
            value: Number(newOrder.value) || 0,
            date: new Date().toISOString().slice(0, 10)
        };

        setOrders((prev) => [createdOrder, ...prev]);
        setShowCreateModal(false);
        setNewOrder({ customer: '', priority: 'medium', items: 1, value: '' });
        addToast(`Order ${createdOrder.id} created successfully.`, 'success');
    };

    return (
        <div className="order-dashboard">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Order Management</h1>
                    <p className="page-subtitle">Manage and track all customer orders</p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setShowCreateModal(true)}>
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
                            {filteredOrders.map((order) => (
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

            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Order"
                footer={(
                    <>
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleCreateOrder}>Create</Button>
                    </>
                )}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    <Input
                        label="Customer Name"
                        value={newOrder.customer}
                        onChange={(e) => setNewOrder((prev) => ({ ...prev, customer: e.target.value }))}
                        placeholder="Enter customer"
                        required
                    />
                    <Input
                        label="No. of Items"
                        type="number"
                        value={newOrder.items}
                        onChange={(e) => setNewOrder((prev) => ({ ...prev, items: e.target.value }))}
                        min={1}
                    />
                    <Input
                        label="Order Value"
                        type="number"
                        value={newOrder.value}
                        onChange={(e) => setNewOrder((prev) => ({ ...prev, value: e.target.value }))}
                        placeholder="Enter total value"
                        min={0}
                        step="0.01"
                        required
                    />
                    <div className="input-group">
                        <label className="input-label">Priority</label>
                        <select
                            className="filter-select"
                            value={newOrder.priority}
                            onChange={(e) => setNewOrder((prev) => ({ ...prev, priority: e.target.value }))}
                            style={{ width: '100%' }}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>
            </Modal>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default OrderDashboard;
