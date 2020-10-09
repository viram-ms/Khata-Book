import React from 'react'
import Sidebar from './Sidebar'
import Details from './Details';
import './Dashboard.css';

function Dashboard() {
    return (
        <div className="Dashboard">
            <Sidebar />
            <Details />
        </div>
    )
}

export default Dashboard
