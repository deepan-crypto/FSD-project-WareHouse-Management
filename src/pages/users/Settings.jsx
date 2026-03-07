import React from 'react';
import './Settings.css';

const Settings = () => {
    return (
        <div className="settings-page">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Application and account settings</p>
            </div>

            <div className="settings-card">
                <p>General application settings will be here. This page is intentionally minimal for now.</p>
            </div>
        </div>
    );
};

export default Settings;
