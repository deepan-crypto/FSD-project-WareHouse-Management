import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Boxes,
    MapPin,
    Users,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { isAdmin } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/orders', icon: Package, label: 'Orders' },
        { path: '/inventory', icon: Boxes, label: 'Inventory' },
        { path: '/tracking', icon: MapPin, label: 'Tracking' },
    ];

    if (isAdmin()) {
        menuItems.push({ path: '/users', icon: Users, label: 'Users' });
    }

    return (
        <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <button
                className="sidebar-toggle"
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle sidebar"
            >
                {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
                        }
                        title={collapsed ? item.label : ''}
                    >
                        <item.icon size={20} className="sidebar-icon" />
                        {!collapsed && <span className="sidebar-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
