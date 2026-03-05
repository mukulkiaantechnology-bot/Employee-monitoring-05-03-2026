import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { IntegrationTabPage } from './IntegrationTabPage';

export function Calendar() {
    const { searchQuery } = useOutletContext();
    const KEYS = ['googleCalendar', 'outlookCalendar'];
    return <IntegrationTabPage integrationKeys={KEYS} searchQuery={searchQuery} />;
}
