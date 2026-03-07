import React from 'react';
import { Package, User, MapPin, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import '../orders/OrderDashboard.css';
import './TrackingDashboard.css';

const TrackingDashboard = () => {
    const trackingData = {
        pending: [
            { id: 'ORD-010', customer: 'Tech Corp', items: 3, priority: 'high' },
            { id: 'ORD-011', customer: 'Global Inc', items: 5, priority: 'medium' },
        ],
        picking: [
            { id: 'ORD-001', customer: 'ABC Corp', items: 5, assignee: 'John Doe', location: 'Zone A' },
            { id: 'ORD-005', customer: 'Innovation Inc', items: 6, assignee: 'Jane Smith', location: 'Zone B' },
        ],
        packing: [
            { id: 'ORD-002', customer: 'XYZ Ltd', items: 3, assignee: 'Mike Johnson', location: 'Pack Station 2' },
        ],
        ready: [
            { id: 'ORD-003', customer: 'Tech Solutions', items: 8, assignee: 'Sarah Lee', completedAt: '14:30' },
        ],
        dispatched: [
            { id: 'ORD-006', customer: 'Market Leaders', items: 4, dispatchedAt: '13:45' },
        ],
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            picking: 'purple',
            packing: 'pink',
            ready: 'success',
            dispatched: 'solid-success',
        };
        return colors[status] || 'default';
    };

    const renderOrderCard = (order, status) => (
        <div key={order.id} className="tracking-order-card">
            <div className="tracking-order-header">
                <span className="tracking-order-id">{order.id}</span>
                {order.priority && <Badge variant={order.priority === 'high' ? 'orange' : 'warning'} size="sm">{order.priority}</Badge>}
            </div>
            <p className="tracking-order-customer">
                <User size={14} /> {order.customer}
            </p>
            <p className="tracking-order-info">
                <Package size={14} /> {order.items} items
            </p>
            {order.assignee && (
                <p className="tracking-order-info">
                    <User size={14} /> {order.assignee}
                </p>
            )}
            {order.location && (
                <p className="tracking-order-info">
                    <MapPin size={14} /> {order.location}
                </p>
            )}
            {(order.completedAt || order.dispatchedAt) && (
                <p className="tracking-order-info">
                    <Clock size={14} /> {order.completedAt || order.dispatchedAt}
                </p>
            )}
        </div>
    );

    return (
        <div className="tracking-dashboard">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Real-Time Tracking</h1>
                    <p className="page-subtitle">Monitor order fulfillment in real-time</p>
                </div>
            </div>

            <div className="tracking-board">
                {Object.entries(trackingData).map(([status, orders]) => (
                    <Card
                        key={status}
                        className="tracking-column"
                        title={
                            <div className="tracking-column-header">
                                <span className="tracking-column-title">{status}</span>
                                <Badge variant={getStatusColor(status)} size="sm">{orders.length}</Badge>
                            </div>
                        }
                    >
                        <div className="tracking-column-content">
                            {orders.length > 0 ? (
                                orders.map(order => renderOrderCard(order, status))
                            ) : (
                                <p className="tracking-empty">No orders</p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrackingDashboard;
