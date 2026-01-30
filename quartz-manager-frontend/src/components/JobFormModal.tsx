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
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface JobFormModalProps {
    initialData?: TriggerInfo | null;
    onClose: () => void;
    onSave: () => void;
}

const JobFormModal: React.FC<JobFormModalProps> = ({ initialData, onClose, onSave }) => {
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>{initialData ? 'Edit Job' : 'Create New Job'}</h3>
                    <button className="btn-link" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.5rem', border: '1px solid var(--danger)', borderRadius: '4px' }}>{error}</div>}

                    {/* Job Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Job Name *</label>
                            <input
                                type="text"
                                value={formData.jobName}
                                onChange={e => setFormData({ ...formData, jobName: e.target.value })}
                                disabled={!!initialData}
                                required
                                className="form-control"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Job Group</label>
                            <input
                                type="text"
                                value={formData.jobGroup}
                                onChange={e => setFormData({ ...formData, jobGroup: e.target.value })}
                                disabled={!!initialData}
                                required
                                className="form-control"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
                            placeholder="Brief description of what this job does"
                        />
                    </div>

                    {/* Cron Expression */}
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cron Expression *</label>
                        <input
                            type="text"
                            value={formData.cronExpression}
                            onChange={e => setFormData({ ...formData, cronExpression: e.target.value })}
                            required
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '0.5rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setCron('0 * * * * ?')} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Every minute</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setCron('0 0/5 * * * ?')} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Every 5 minutes</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setCron('0 0 * * * ?')} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Every hour</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setCron('0 0 0 * * ?')} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Every day at midnight</button>
                        </div>
                    </div>

                    <hr style={{ margin: '1.5rem 0', border: 0, borderTop: '1px solid #eee' }} />

                    {/* HTTP Configuration */}
                    <h4 style={{ margin: '0 0 1rem 0' }}>HTTP Configuration</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Method</label>
                            <select
                                value={formData.method}
                                onChange={e => setFormData({ ...formData, method: e.target.value })}
                                className="form-control"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Endpoint URL *</label>
                            <input
                                type="text"
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                required
                                className="form-control"
                                placeholder="https://api.example.com/webhook"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>

                    {['POST', 'PUT'].includes(formData.method) && (
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Request Body</label>
                            <textarea
                                value={formData.body}
                                onChange={e => setFormData({ ...formData, body: e.target.value })}
                                className="form-control"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'monospace' }}
                                placeholder='{ "key": "value" }'
                            />
                        </div>
                    )}

                    {/* Additional Properties */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Additional Properties (Headers, Data)</label>
                        {additionalProps.map((prop, index) => (
                            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Key (e.g., header.Authorization)"
                                    value={prop.key}
                                    onChange={e => handlePropChange(index, 'key', e.target.value)}
                                    className="form-control"
                                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={prop.value}
                                    onChange={e => handlePropChange(index, 'value', e.target.value)}
                                    className="form-control"
                                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button type="button" onClick={() => handleRemoveProp(index)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary" onClick={handleAddProp} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                            <Plus size={16} style={{ marginRight: 4 }} /> Add Property
                        </button>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Prefix keys with <code>header.</code> to send as HTTP headers.
                        </p>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '0.75rem 1.5rem' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem' }}>
                            <Save size={18} style={{ marginRight: 8 }} />
                            {initialData ? 'Update Job' : 'Create Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobFormModal;
