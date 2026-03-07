import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Profile.css';

const Profile = () => {
    const { user, updateUser, isAdmin } = useAuth();
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = () => {
        setSaving(true);
        // For now update local user data via context
        updateUser({ name: form.name, email: form.email });
        setTimeout(() => setSaving(false), 600);
    };

    return (
        <div className="profile-page">
            <div className="page-header">
                <h1 className="page-title">Profile</h1>
                <p className="page-subtitle">Manage your account details</p>
            </div>

            <div className="profile-card">
                <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
                <Input label="Email" name="email" value={form.email} onChange={handleChange} />

                <div style={{ marginTop: '12px' }}>
                    <Button variant="primary" onClick={handleSave} loading={saving}>Save</Button>
                </div>
            </div>

            {isAdmin() && (
                <div className="admin-section">
                    <h2>Admin Controls</h2>
                    <p>Because you're an admin, you can access administrative tools and reports.</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant="secondary">View System Logs</Button>
                        <Button variant="ghost">Manage Integrations</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
