import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './MenuBar.css';

const MenuBar = () => {
    const location = useLocation();

    const navItems = [
        { to: '/about', label: 'About' },
        { to: '/marketplace', label: 'Marketplace' },
        { to: '/faq', label: 'FAQ' },
    ];

    return (
        <nav className="header">
            <div className="nav-wrapper">
                <Link className="logo" to="/">
                    <svg width="30" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="20" r="10" stroke="#006EFF"/>
                        <circle cx="15" cy="20" r="6" stroke="#006EFF" strokeWidth="3"/>
                    </svg>                 
                    Billion Towers
                </Link>
                <input className="menu-btn" type="checkbox" id="menu-btn"/>
                <label className="menu-icon" htmlFor="menu-btn"><span className="navicon"></span></label>

                <ul className="menu">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                className={location.pathname === item.to ? 'active' : ''}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li><button className='button'>Connect</button></li>                
                </ul>
            </div>
        </nav>
    );
};

export default MenuBar;
