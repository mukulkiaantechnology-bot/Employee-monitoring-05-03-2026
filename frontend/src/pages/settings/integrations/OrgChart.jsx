import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { IntegrationTabPage } from './IntegrationTabPage';

export function OrgChart() {
    const { searchQuery } = useOutletContext();
    const KEYS = ['csvImport', 'alexisHR', 'bambooHR', 'chartHop', 'googleWorkspace', 'hibob'];
    return <IntegrationTabPage integrationKeys={KEYS} searchQuery={searchQuery} />;
}
