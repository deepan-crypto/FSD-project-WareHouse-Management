import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Navbar />
            <div className="main-layout-container">
                <Sidebar />
                <main className="main-content">
                    <div className="main-content-inner">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
