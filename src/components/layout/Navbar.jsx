import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">
                    <Package size={28} />
                    <span className="navbar-brand">WarehouseHub</span>
                </div>
            </div>

            <div className="navbar-center">
                <div className="navbar-search">
                    <input
                        type="search"
                        placeholder="Search orders, products..."
                        className="navbar-search-input"
                    />
                </div>
            </div>

            <div className="navbar-right">
                <button className="navbar-icon-button" aria-label="Notifications">
                    <Bell size={20} />
                    <span className="navbar-notification-badge">3</span>
                </button>

                <div className="navbar-user-menu">
                    <button
                        className="navbar-user-button"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="navbar-user-avatar">
                            <User size={18} />
                        </div>
                        <div className="navbar-user-info hide-mobile">
                            <div className="navbar-user-name">{user?.name}</div>
                            <div className="navbar-user-role">{user?.role}</div>
                        </div>
                    </button>

                    {showUserMenu && (
                        <div className="navbar-dropdown">
                            <Link to="/profile" className="navbar-dropdown-item" onClick={() => setShowUserMenu(false)}>
                                <User size={16} />
                                <span>Profile</span>
                            </Link>
                            <Link to="/settings" className="navbar-dropdown-item" onClick={() => setShowUserMenu(false)}>
                                <Settings size={16} />
                                <span>Settings</span>
                            </Link>
                            <div className="navbar-dropdown-divider"></div>
                            <button className="navbar-dropdown-item" onClick={handleLogout}>
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
