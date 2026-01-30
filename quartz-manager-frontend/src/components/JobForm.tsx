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
import type { TriggerInfo } from '../types';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';

interface JobFormProps {
    initialData?: TriggerInfo | null;
    onBack: () => void;
    onSave: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onBack, onSave }) => {
    const [formData, setFormData] = useState({
        jobName: '',
        jobGroup: 'DEFAULT',
        description: '',
        cronExpression: '0 0/5 * * * ?',
        method: 'GET',
        url: '',
        body: ''
    });

    const [additionalProps, setAdditionalProps] = useState<{ key: string; value: string }[]>([]);
    const [error, setError] = useState('');
    const [jobGroups, setJobGroups] = useState<string[]>(['DEFAULT']);

    // Fetch existing job groups
    useEffect(() => {
        const fetchJobGroups = async () => {
            try {
                const response = await fetch('/api/jobs/groups');
                if (response.ok) {
                    const groups = await response.json();
                    // Always include DEFAULT if not present
                    const uniqueGroups = Array.from(new Set([...groups, 'DEFAULT']));
                    setJobGroups(uniqueGroups);
                }
            } catch (error) {
                console.error('Failed to fetch job groups:', error);
            }
        };
        fetchJobGroups();
    }, []);

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
        }
    }, [initialData]);

    const handleAddProp = () => {
        setAdditionalProps([...additionalProps, { key: '', value: '' }]);
    };

    const handleRemoveProp = (index: number) => {
        setAdditionalProps(additionalProps.filter((_, i) => i !== index));
    };

    const handlePropChange = (index: number, field: 'key' | 'value', val: string) => {
        const newProps = [...additionalProps];
        newProps[index][field] = val;
        setAdditionalProps(newProps);
    };

    const setCron = (expr: string) => {
        setFormData({ ...formData, cronExpression: expr });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Construct JobDataMap
            const jobDataMap: Record<string, string> = {
                method: formData.method,
                url: formData.url,
                body: formData.body
            };

            additionalProps.forEach(p => {
                if (p.key.trim()) {
                    jobDataMap[p.key.trim()] = p.value;
                }
            });

            const payload = {
                jobName: formData.jobName,
                jobGroup: formData.jobGroup,
                description: formData.description,
                cronExpression: formData.cronExpression,
                jobDataMap
            };

            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to schedule job');
            }

            onSave();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={onBack}
                    className="btn"
                    style={{ background: '#fff', border: '1px solid var(--glass-border)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ArrowLeft size={20} color="var(--text-main)" />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{initialData ? 'Edit Job' : 'Create New Job'}</h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Schedule a new HTTP endpoint to be called periodically</p>
                </div>
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem', background: '#fff' }}>
                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.5rem', border: '1px solid var(--danger)', borderRadius: '4px' }}>{error}</div>}

                    <h4 style={{ margin: '0 0 1rem 0' }}>{initialData ? 'Edit Job Details' : 'Create New Job'}</h4>

                    {/* Job Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Job Name *</label>
                            <input
                                type="text"
                                value={formData.jobName}
                                onChange={e => setFormData({ ...formData, jobName: e.target.value })}
                                disabled={!!initialData}
                                required
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
                                placeholder="my-job-name"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Job Group</label>
                            <input
                                type="text"
                                list="job-groups-list"
                                value={formData.jobGroup}
                                onChange={e => setFormData({ ...formData, jobGroup: e.target.value })}
                                disabled={!!initialData}
                                required
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
                                placeholder="DEFAULT"
                            />
                            <datalist id="job-groups-list">
                                {jobGroups.map(group => (
                                    <option key={group} value={group} />
                                ))}
                            </datalist>
                            <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                                Select existing group or type a new one
                            </small>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="form-control"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '80px', fontSize: '1rem' }}
                            placeholder="Brief description of what this job does"
                        />
                    </div>

                    {/* Cron Expression */}
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Cron Expression *</label>
                        <input
                            type="text"
                            value={formData.cronExpression}
                            onChange={e => setFormData({ ...formData, cronExpression: e.target.value })}
                            required
                            className="form-control"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '0.75rem', fontFamily: 'monospace' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button type="button" className="btn" onClick={() => setCron('0 * * * * ?')} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>Every minute</button>
                            <button type="button" className="btn" onClick={() => setCron('0 0/5 * * * ?')} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>Every 5 minutes</button>
                            <button type="button" className="btn" onClick={() => setCron('0 0 * * * ?')} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>Every hour</button>
                            <button type="button" className="btn" onClick={() => setCron('0 0 0 * * ?')} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>Every day at midnight</button>
                            <button type="button" className="btn" onClick={() => setCron('0 0 9 ? * MON-FRI')} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>Every weekday at 9 AM</button>
                            <button type="button" className="btn" onClick={() => setCron('0 0 9 ? * MON')} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>Every Monday at 9 AM</button>
                        </div>
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
                            <select
                                value={formData.method}
                                onChange={e => setFormData({ ...formData, method: e.target.value })}
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff' }}
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Endpoint URL *</label>
                            <input
                                type="text"
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                required
                                className="form-control"
                                placeholder="https://api.example.com/webhook"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                    </div>

                    {['POST', 'PUT'].includes(formData.method) && (
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Request Body</label>
                            <textarea
                                value={formData.body}
                                onChange={e => setFormData({ ...formData, body: e.target.value })}
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '100px', fontFamily: 'monospace' }}
                                placeholder='{ "key": "value" }'
                            />
                        </div>
                    )}

                    {/* Additional Properties */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Additional Properties (Headers, Certificates, Data)</label>
                        {additionalProps.map((prop, index) => (
                            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Key (e.g., Authorization, Content-Type)"
                                    value={prop.key}
                                    onChange={e => handlePropChange(index, 'key', e.target.value)}
                                    className="form-control"
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={prop.value}
                                    onChange={e => handlePropChange(index, 'value', e.target.value)}
                                    className="form-control"
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                />
                                <button type="button" onClick={() => handleRemoveProp(index)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    <Trash2 size={18} color="var(--text-muted)" />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="btn" onClick={handleAddProp} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', fontSize: '0.9rem', background: '#fff', border: '1px solid #e2e8f0' }}>
                            <Plus size={16} style={{ marginRight: 6 }} /> Add
                        </button>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Common examples: Authorization, Content-Type, X-API-Key, cert-path, etc.
                        </p>
                    </div>

                    <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn" onClick={onBack} style={{ padding: '0.75rem 1.5rem', background: '#fff', border: '1px solid #e2e8f0' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 2rem' }}>
                            <Save size={18} style={{ marginRight: 8 }} />
                            {initialData ? 'Update Job' : 'Create Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobForm;
