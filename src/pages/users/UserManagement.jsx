import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { ToastContainer } from '../../components/common/Toast';
import api from '../../services/api';
import '../orders/OrderDashboard.css';

const UserManagement = () => {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'staff' });
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const response = await api.get('/admin/users');
                const normalized = (response.data || []).map((user) => ({
                    ...user,
                    ordersCompleted: user.ordersCompleted ?? 0,
                    role: Array.isArray(user.roles) ? user.roles[0]?.replace(/^ROLE_/i, '').toLowerCase() : (user.role || 'staff'),
                    isActive: user.isActive !== undefined ? user.isActive : true
                }));
                setUsers(normalized);
            } catch (error) {
                addToast(error.message || 'Failed to load users', 'error');
            } finally {
                setLoadingUsers(false);
            }
        };
        
        fetchUsers();
    }, []);

    const getRoleBadgeVariant = (role) => {
        const variants = {
            'admin': 'solid-danger',
            'supervisor': 'solid-primary',
            'staff': 'info'
        };
        return variants[role] || 'default';
    };

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            addToast('Name, email and password are required.', 'warning');
            return;
        }

        setSaving(true);
        try {
            await api.post('/auth/register', newUser);
            // Re-fetch user list after creating
            const refreshResp = await api.get('/admin/users');
            const normalized = (refreshResp.data || []).map((u) => ({
                ...u,
                ordersCompleted: u.ordersCompleted ?? 0,
                role: Array.isArray(u.roles) ? u.roles[0]?.replace(/^ROLE_/i, '').toLowerCase() : (u.role || 'staff'),
                isActive: u.isActive !== undefined ? u.isActive : true
            }));
            setUsers(normalized);
            setShowAddUserModal(false);
            setNewUser({ name: '', email: '', password: '', role: 'staff' });
            addToast('User created successfully.', 'success');
        } catch (error) {
            addToast(error.message || 'Failed to create user', 'error');
        } finally {
            setSaving(false);
        }
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
                            {!loadingUsers && users.length === 0 && (
                                <tr>
                                    <td colSpan={6}>No users found.</td>
                                </tr>
                            )}
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
                        <Button variant="primary" onClick={handleAddUser} loading={saving}>
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

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default UserManagement;
