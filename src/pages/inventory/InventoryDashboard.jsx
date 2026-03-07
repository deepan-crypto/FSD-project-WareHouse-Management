import React, { useState } from 'react';
import { Package, TrendingDown, AlertCircle, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { ToastContainer } from '../../components/common/Toast';
import '../orders/OrderDashboard.css';

const InventoryDashboard = () => {
    const [products, setProducts] = useState([
        { sku: 'PROD-001', name: 'Widget A', category: 'Electronics', stock: 150, reserved: 30, reorderLevel: 50 },
        { sku: 'PROD-002', name: 'Component B', category: 'Parts', stock: 85, reserved: 15, reorderLevel: 40 },
        { sku: 'PROD-003', name: 'Device C', category: 'Electronics', stock: 12, reserved: 5, reorderLevel: 50 },
        { sku: 'PROD-004', name: 'Tool D', category: 'Tools', stock: 45, reserved: 10, reorderLevel: 20 },
        { sku: 'PROD-005', name: 'Material E', category: 'Raw Materials', stock: 8, reserved: 2, reorderLevel: 30 },
    ]);
    const [syncing, setSyncing] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [showAddIncoming, setShowAddIncoming] = useState(false);
    const [incomingForm, setIncomingForm] = useState({
        sku: '',
        quantity: ''
    });
    const [incomingError, setIncomingError] = useState('');

    const addToast = (message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const isLowStock = (stock, reorderLevel) => stock <= reorderLevel;

    const handleSyncInventory = () => {
        setSyncing(true);

        setTimeout(() => {
            // Simulate sync by adjusting stock by a tiny random delta.
            setProducts((prev) => prev.map((product) => {
                const delta = Math.floor(Math.random() * 5) - 2;
                const stock = Math.max(0, product.stock + delta);
                return { ...product, stock };
            }));
            const syncTime = new Date();
            setLastSyncedAt(syncTime);
            setSyncing(false);
            addToast(`Inventory synced at ${syncTime.toLocaleTimeString()}.`, 'success');
        }, 800);
    };

    const handleAddIncoming = () => {
        setIncomingError('');
        
        if (!incomingForm.sku.trim()) {
            setIncomingError('Please select a product');
            return;
        }
        
        if (!incomingForm.quantity || parseInt(incomingForm.quantity) <= 0) {
            setIncomingError('Please enter a valid quantity');
            return;
        }

        const product = products.find(p => p.sku === incomingForm.sku);
        if (!product) {
            setIncomingError('Product not found');
            return;
        }

        const quantity = parseInt(incomingForm.quantity);
        setProducts((prev) => prev.map(p => 
            p.sku === incomingForm.sku 
                ? { ...p, stock: p.stock + quantity }
                : p
        ));

        addToast(`Added ${quantity} units of ${product.name} to inventory.`, 'success');
        setShowAddIncoming(false);
        setIncomingForm({ sku: '', quantity: '' });
    };

    return (
        <div className="inventory-dashboard">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Inventory Management</h1>
                    <p className="page-subtitle">Monitor stock levels and manage inventory</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={() => setShowAddIncoming(true)}>
                        <Plus size={18} style={{ marginRight: '6px' }} />
                        Add Incoming Products
                    </Button>
                    <Button variant="success" onClick={handleSyncInventory} loading={syncing}>
                        Sync Inventory
                    </Button>
                </div>
            </div>

            {lastSyncedAt && (
                <p className="page-subtitle" style={{ marginBottom: 0 }}>
                    Last synced: {lastSyncedAt.toLocaleString()}
                </p>
            )}

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

            <Modal
                isOpen={showAddIncoming}
                onClose={() => {
                    setShowAddIncoming(false);
                    setIncomingError('');
                }}
                title="Add Incoming Products"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {incomingError && (
                        <div style={{
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            padding: '12px',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}>
                            {incomingError}
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                            Select Product
                        </label>
                        <select
                            value={incomingForm.sku}
                            onChange={(e) => setIncomingForm(prev => ({ ...prev, sku: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontFamily: 'inherit'
                            }}
                        >
                            <option value="">-- Select a Product --</option>
                            {products.map(p => (
                                <option key={p.sku} value={p.sku}>
                                    {p.name} ({p.sku})
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Quantity to Add"
                        type="number"
                        name="quantity"
                        value={incomingForm.quantity}
                        onChange={(e) => setIncomingForm(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder="Enter quantity"
                        min="1"
                    />

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowAddIncoming(false);
                                setIncomingError('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleAddIncoming}>
                            Add to Inventory
                        </Button>
                    </div>
                </div>
            </Modal>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default InventoryDashboard;
