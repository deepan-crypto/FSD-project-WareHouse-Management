import React from 'react';
import { Package, TrendingDown, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import '../orders/OrderDashboard.css';

const InventoryDashboard = () => {
    const products = [
        { sku: 'PROD-001', name: 'Widget A', category: 'Electronics', stock: 150, reserved: 30, reorderLevel: 50 },
        { sku: 'PROD-002', name: 'Component B', category: 'Parts', stock: 85, reserved: 15, reorderLevel: 40 },
        { sku: 'PROD-003', name: 'Device C', category: 'Electronics', stock: 12, reserved: 5, reorderLevel: 50 },
        { sku: 'PROD-004', name: 'Tool D', category: 'Tools', stock: 45, reserved: 10, reorderLevel: 20 },
        { sku: 'PROD-005', name: 'Material E', category: 'Raw Materials', stock: 8, reserved: 2, reorderLevel: 30 },
    ];

    const isLowStock = (stock, reorderLevel) => stock <= reorderLevel;

    return (
        <div className="inventory-dashboard">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Inventory Management</h1>
                    <p className="page-subtitle">Monitor stock levels and manage inventory</p>
                </div>
                <Button variant="success">Sync Inventory</Button>
            </div>

            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon stat-icon-primary">
                            <Package size={24} />
                        </div>
                        <div className="stat-details">
                            <p className="stat-label">Total Products</p>
                            <h3 className="stat-value">{products.length}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon stat-icon-warning">
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-details">
                            <p className="stat-label">Low Stock Items</p>
                            <h3 className="stat-value">{products.filter(p => isLowStock(p.stock, p.reorderLevel)).length}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon stat-icon-info">
                            <TrendingDown size={24} />
                        </div>
                        <div className="stat-details">
                            <p className="stat-label">Reserved Items</p>
                            <h3 className="stat-value">{products.reduce((sum, p) => sum + p.reserved, 0)}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="Product Inventory">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Stock Level</th>
                                <th>Reserved</th>
                                <th>Available</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                const available = product.stock - product.reserved;
                                const lowStock = isLowStock(product.stock, product.reorderLevel);

                                return (
                                    <tr key={product.sku}>
                                        <td className="order-id">{product.sku}</td>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.reserved}</td>
                                        <td className={lowStock ? 'order-value' : ''}>{available}</td>
                                        <td>
                                            {lowStock ? (
                                                <Badge variant="warning" size="sm" dot>Low Stock</Badge>
                                            ) : (
                                                <Badge variant="success" size="sm">In Stock</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <Button size="sm" variant="ghost">Adjust</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default InventoryDashboard;
