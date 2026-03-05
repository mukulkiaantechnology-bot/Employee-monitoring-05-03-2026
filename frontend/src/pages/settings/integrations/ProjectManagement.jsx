import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { IntegrationTabPage } from './IntegrationTabPage';

export function ProjectManagement() {
    const { searchQuery } = useOutletContext();
    const KEYS = ['asana', 'azureDevops', 'clickup', 'height', 'jira', 'teamwork'];
    return <IntegrationTabPage integrationKeys={KEYS} searchQuery={searchQuery} />;
}
