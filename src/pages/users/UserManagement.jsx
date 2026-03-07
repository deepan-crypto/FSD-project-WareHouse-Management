import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import '../orders/OrderDashboard.css';

const UserManagement = () => {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'staff' });

    const users = [
        { id: 1, name: 'John Doe', email: 'john.doe@warehouse.com', role: 'staff', isActive: true, ordersCompleted: 145 },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@warehouse.com', role: 'supervisor', isActive: true, ordersCompleted: 132 },
        { id: 3, name: 'Mike Johnson', email: 'mike.j@warehouse.com', role: 'staff', isActive: true, ordersCompleted: 128 },
        { id: 4, name: 'Sarah Lee', email: 'sarah.lee@warehouse.com', role: 'admin', isActive: true, ordersCompleted: 118 },
        { id: 5, name: 'Tom Brown', email: 'tom.brown@warehouse.com', role: 'staff', isActive: false, ordersCompleted: 95 },
    ];

    const getRoleBadgeVariant = (role) => {
        const variants = {
            'admin': 'solid-danger',
            'supervisor': 'solid-primary',
            'staff': 'info'
        };
        return variants[role] || 'default';
    };

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            return;
        }
        console.log('Adding user:', newUser);
        setShowAddUserModal(false);
        setNewUser({ name: '', email: '', password: '', role: 'staff' });
    };

    return (
        <div className=" user-management">
            <div className="page-header">
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">Manage warehouse staff and permissions</p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setShowAddUserModal(true)}>
                    Add User
                </Button>
            </div>

            <Card title="All Users">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Orders Completed</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge variant={user.isActive ? 'success' : 'default'} size="sm" dot={user.isActive}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td>{user.ordersCompleted}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Button size="sm" variant="ghost">Edit</Button>
                                            <Button size="sm" variant="ghost">
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={showAddUserModal}
                onClose={() => setShowAddUserModal(false)}
                title="Add New User"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowAddUserModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddUser}>
                            Add User
                        </Button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    <Input
                        label="Full Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Enter full name"
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Enter email address"
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Enter temporary password"
                        required
                    />
                    <div className="input-group">
                        <label className="input-label">Role *</label>
                        <select
                            className="filter-select"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            style={{ width: '100%' }}
                        >
                            <option value="staff">Staff</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagement;
