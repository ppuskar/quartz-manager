/*
 * Copyright (c) 2026 Quartz Manager Contributors
 *
 * This file is part of Quartz Manager.
 *
 * Quartz Manager is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License with Non-Commercial Restriction.
 *
 * This software may NOT be used for commercial purposes.
 * See the LICENSE file in the project root for full license information.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */

import React, { useState } from 'react';
import type { TriggerInfo } from '../types';
import { ChevronDown, ChevronUp, Eye, Trash2, Edit, History } from 'lucide-react';

interface TriggerListProps {
    triggers: TriggerInfo[];
    onRefresh: () => void;
    onEdit: (trigger: TriggerInfo) => void;
    onView: (trigger: TriggerInfo) => void;
    onViewHistory: (trigger: TriggerInfo) => void;
}

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Never' || dateStr === 'Completed') return dateStr;
    try {
        const iso = dateStr.replace(' ', 'T') + 'Z';
        return new Date(iso).toLocaleString();
    } catch (e) {
        return dateStr;
    }
};

const TriggerList: React.FC<TriggerListProps> = ({ triggers, onRefresh, onEdit, onView, onViewHistory }) => {
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    const handleDelete = async (trigger: TriggerInfo) => {
        if (!confirm(`Are you sure you want to delete job "${trigger.jobName}"?`)) return;

        try {
            const response = await fetch(`/api/jobs/${trigger.jobGroup}/${trigger.jobName}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                onRefresh();
            } else {
                alert('Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Error deleting job');
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedGroup(expandedGroup === id ? null : id);
    };

    return (
        <div className="job-list">
            {triggers.map((trigger) => {
                const id = `${trigger.jobGroup}-${trigger.jobName}-${trigger.triggerName}`;
                const isExpanded = expandedGroup === id;

                return (
                    <div key={id} className="trigger-item glass-panel">
                        <div className="trigger-header" onClick={() => toggleExpand(id)}>
                            <div className="trigger-info">
                                <div className="job-name">
                                    <span>{trigger.jobName}</span>
                                    <span className="job-group">{trigger.jobGroup}</span>
                                </div>

                                <span className={`status-badge status-${trigger.state}`}>
                                    {trigger.state}
                                </span>

                                <div className="execution-time">
                                    <span className="execution-label">Next Run</span>
                                    <span>{formatDate(trigger.nextExecutionTime)}</span>
                                </div>

                                <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="btn btn-secondary btn-icon"
                                        onClick={() => onViewHistory(trigger)}
                                        title="View History"
                                    >
                                        <History size={16} />
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-icon"
                                        onClick={() => onView(trigger)}
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-icon"
                                        onClick={() => onEdit(trigger)}
                                        title="Edit Job"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="btn btn-danger btn-icon"
                                        onClick={() => handleDelete(trigger)}
                                        title="Delete Job"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        <div className={`trigger-details ${isExpanded ? 'open' : ''}`}>
                            {isExpanded && (
                                <div className="data-grid">
                                    <span className="data-label">Trigger Name:</span>
                                    <span>{trigger.triggerName}</span>

                                    <span className="data-label">Trigger Group:</span>
                                    <span>{trigger.triggerGroup}</span>

                                    <span className="data-label">Cron Expression:</span>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{trigger.cronExpression}</span>

                                    <span className="data-label">Description:</span>
                                    <span>{trigger.description || 'No description'}</span>

                                    {trigger.jobDataMap && Object.keys(trigger.jobDataMap).length > 0 && (
                                        <>
                                            <span className="data-label">Job Data:</span>
                                            <div style={{ background: 'white', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)', fontSize: '0.8125rem' }}>
                                                {Object.entries(trigger.jobDataMap).map(([key, value]) => (
                                                    <div key={key} style={{ marginBottom: '0.25rem' }}>
                                                        <strong style={{ color: 'var(--primary)' }}>{key}:</strong>{' '}
                                                        <span style={{ fontFamily: 'monospace' }}>{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TriggerList;
