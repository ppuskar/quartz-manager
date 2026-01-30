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
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface JobDetailsProps {
    initialData: TriggerInfo;
    onBack: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ initialData, onBack }) => {
    const [formData, setFormData] = useState({
        jobName: '',
        jobGroup: 'DEFAULT',
        description: '',
        cronExpression: '',
        method: 'GET',
        url: '',
        body: ''
    });

    const [additionalProps, setAdditionalProps] = useState<{ key: string; value: string }[]>([]);
    const [history, setHistory] = useState<ExecutionLog[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

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

    useEffect(() => {
        if (initialData) {
            const dataMap = initialData.jobDataMap || {};

            // Extract HTTP config from dataMap
            const method = dataMap['method'] || 'GET';
            const url = dataMap['url'] || '';
            const body = dataMap['body'] || '';

            // Extract additional props (exclude special keys)
            const props: { key: string; value: string }[] = [];
            Object.entries(dataMap).forEach(([k, v]) => {
                if (!['method', 'url', 'body'].includes(k)) {
                    props.push({ key: k, value: String(v) });
                }
            });

            setFormData({
                jobName: initialData.jobName,
                jobGroup: initialData.jobGroup,
                description: initialData.description || '',
                cronExpression: initialData.cronExpression,
                method,
                url,
                body
            });
            setAdditionalProps(props);
            fetchHistory(initialData.jobGroup, initialData.jobName);
        }
    }, [initialData]);

    const fetchHistory = async (group: string, name: string) => {
        setLoadingHistory(true);
        try {
            const response = await fetch(`/api/history/${group}/${name}`);
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setLoadingHistory(false);
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
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Job Details</h1>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            {formData.jobName} <span style={{ color: 'var(--text-light)' }}>•</span> {formData.jobGroup}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', background: '#fff' }}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <h4 style={{ margin: '0 0 1rem 0' }}>Job Information</h4>

                        {/* Job Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Job Name</label>
                                <input
                                    type="text"
                                    value={formData.jobName}
                                    disabled
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem', background: '#f8fafc' }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Job Group</label>
                                <input
                                    type="text"
                                    value={formData.jobGroup}
                                    disabled
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem', background: '#f8fafc' }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Description</label>
                            <textarea
                                value={formData.description}
                                disabled
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '80px', fontSize: '1rem', background: '#f8fafc' }}
                            />
                        </div>

                        {/* Cron Expression */}
                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Cron Expression</label>
                            <input
                                type="text"
                                value={formData.cronExpression}
                                disabled
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '0.75rem', fontFamily: 'monospace', background: '#f8fafc' }}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                Format: second minute hour day month weekday [year]
                            </p>
                        </div>

                        <hr style={{ margin: '2rem 0', border: 0, borderTop: '1px solid #e2e8f0' }} />

                        {/* HTTP Configuration */}
                        <h4 style={{ margin: '0 0 1rem 0' }}>HTTP Configuration</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 4fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Method</label>
                                <input
                                    type="text"
                                    value={formData.method}
                                    disabled
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Endpoint URL</label>
                                <input
                                    type="text"
                                    value={formData.url}
                                    disabled
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                />
                            </div>
                        </div>

                        {['POST', 'PUT'].includes(formData.method) && (
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Request Body</label>
                                <textarea
                                    value={formData.body}
                                    disabled
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '100px', fontFamily: 'monospace', background: '#f8fafc' }}
                                />
                            </div>
                        )}

                        {/* Additional Properties */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Additional Properties (Headers, Certificates, Data)</label>
                            {additionalProps.length > 0 ? (
                                additionalProps.map((prop, index) => (
                                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={prop.key}
                                            disabled
                                            className="form-control"
                                            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                        />
                                        <input
                                            type="text"
                                            value={prop.value}
                                            disabled
                                            className="form-control"
                                            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                                    No additional properties configured
                                </div>
                            )}
                        </div>

                        <hr style={{ margin: '2rem 0', border: 0, borderTop: '1px solid #e2e8f0' }} />

                        {/* Execution History & Stats */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0 }}>Execution History</h4>
                            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>Last Run:</span>
                                    <span style={{ fontWeight: 500 }}>{formatDate(initialData.lastExecutionTime)}</span>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>Next Run:</span>
                                    <span style={{ fontWeight: 500 }}>{formatDate(initialData.nextExecutionTime)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ background: '#f8fafc', padding: 0, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Fire Time</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Duration</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingHistory ? (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading history...</td>
                                        </tr>
                                    ) : history.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No execution history found</td>
                                        </tr>
                                    ) : (
                                        history.map(log => (
                                            <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {getStatusIcon(log.status)}
                                                    <span style={{ fontWeight: 500, color: log.status === 'SUCCESS' ? 'var(--success)' : log.status === 'FAILURE' ? 'var(--danger)' : 'var(--warning)' }}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>{formatDate(log.fireTime)}</td>
                                                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>{log.duration}ms</td>
                                                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.message}>
                                                    {log.message}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;

