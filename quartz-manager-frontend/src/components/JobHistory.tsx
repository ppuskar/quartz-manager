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

import React, { useState, useEffect } from 'react';
import type { TriggerInfo, ExecutionLog } from '../types';
import { ArrowLeft, Clock, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface JobHistoryProps {
    job: TriggerInfo;
    onBack: () => void;
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

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'SUCCESS': return <CheckCircle size={16} color="var(--success)" />;
        case 'FAILURE': return <XCircle size={16} color="var(--danger)" />;
        default: return <AlertCircle size={16} color="var(--warning)" />;
    }
};

const JobHistory: React.FC<JobHistoryProps> = ({ job, onBack }) => {
    const [history, setHistory] = useState<ExecutionLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, [job]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/history/${job.jobGroup}/${job.jobName}`);
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            {/* Floating Header */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'white',
                borderBottom: '1px solid var(--glass-border)',
                padding: '1.5rem 2rem',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={onBack}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Execution History</h1>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            {job.jobName} <span style={{ color: 'var(--text-light)' }}>•</span> {job.jobGroup}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                {/* Job Info Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <Calendar size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                Last Run
                            </h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {formatDate(job.lastExecutionTime)}
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <Clock size={20} color="var(--success)" />
                            <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                Next Run
                            </h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {formatDate(job.nextExecutionTime)}
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <CheckCircle size={20} color="var(--text-muted)" />
                            <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                Total Executions
                            </h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {history.length}
                        </p>
                    </div>
                </div>

                {/* Execution History Table */}
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Execution History</h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Recent job executions (last 20)
                        </p>
                    </div>

                    {loading ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                            <p>Loading execution history...</p>
                        </div>
                    ) : history.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fire Time</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Time</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((log, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {getStatusIcon(log.status)}
                                                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{log.status}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{formatDate(log.fireTime)}</td>
                                            <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{formatDate(log.endTime)}</td>
                                            <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{log.duration}ms</td>
                                            <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {log.message || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>No execution history</p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>This job hasn't been executed yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobHistory;
