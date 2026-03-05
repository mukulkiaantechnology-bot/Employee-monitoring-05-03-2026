import React from 'react';
import { Outlet } from 'react-router-dom';

export function Reports() {
    return (
        <div className="animate-in fade-in duration-500">
            <Outlet />
        </div>
    );
}
