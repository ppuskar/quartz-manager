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

import { useEffect, useState } from 'react';
import './styles/main.css';
import TriggerList from './components/TriggerList';
import type { TriggerInfo } from './types';
import { Layers, Plus, XCircle, CheckCircle, Search, RefreshCw, LayoutDashboard, Home } from 'lucide-react';
import JobForm from './components/JobForm';
import JobDetails from './components/JobDetails';
import JobHistory from './components/JobHistory';

function App() {
    const [triggers, setTriggers] = useState<TriggerInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Navigation State
    const [view, setView] = useState<'dashboard' | 'form' | 'details' | 'history'>('dashboard');
    const [editingJob, setEditingJob] = useState<TriggerInfo | null>(null);
    const [viewingJob, setViewingJob] = useState<TriggerInfo | null>(null);

    useEffect(() => {
        fetchTriggers();
        const interval = setInterval(fetchTriggers, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchTriggers = async () => {
        try {
            const response = await fetch('/api/jobs');
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            setTriggers(data);
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = () => {
        setEditingJob(null);
        setView('form');
    };

    const handleEditJob = (job: TriggerInfo) => {
        setEditingJob(job);
        setView('form');
    };

    const handleViewJob = (job: TriggerInfo) => {
        setViewingJob(job);
        setView('details');
    };

    const handleViewHistory = (job: TriggerInfo) => {
        setViewingJob(job);
        setView('history');
    };

    const handleBack = () => {
        setView('dashboard');
        setEditingJob(null);
        setViewingJob(null);
    };

    const handleSave = () => {
        setView('dashboard');
        setEditingJob(null);
        fetchTriggers();
    };

    // Calculate Stats
    const totalJobs = triggers.length;
    const activeJobs = triggers.filter(t => t.state !== 'PAUSED').length;
    const pausedJobs = triggers.filter(t => t.state === 'PAUSED').length;

    const filteredTriggers = triggers.filter(t =>
        t.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.jobGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Render Form View
    if (view === 'form') {
        return <JobForm initialData={editingJob} onBack={handleBack} onSave={handleSave} />;
    }

    // Render Details View
    if (view === 'details' && viewingJob) {
        return <JobDetails initialData={viewingJob} onBack={handleBack} />;
    }

    // Render History View
    if (view === 'history' && viewingJob) {
        return <JobHistory job={viewingJob} onBack={handleBack} />;
    }

    // Render Dashboard View
    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Layers size={20} color="white" />
                    </div>
                    <h1 className="sidebar-title">Quartz-Manager</h1>
                </div>
                <nav className="sidebar-nav">
                    <button className="nav-item active">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Header */}
                <header className="top-header">
                    <div className="breadcrumb">
                        <Home size={16} />
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">Dashboard</span>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-secondary btn-icon" onClick={fetchTriggers} title="Refresh">
                            <RefreshCw size={18} />
                        </button>
                        <button className="btn btn-primary" onClick={handleCreateJob}>
                            <Plus size={18} />
                            Create Job
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="content-area">
                    <div className="page-header" style={{ marginBottom: '2rem' }}>
                        <h1 className="page-title">Scheduler Dashboard</h1>
                        <p className="page-subtitle">Monitor and manage your scheduled jobs</p>
                    </div>

                    {error && (
                        <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-info">
                                <h3>Total Jobs</h3>
                                <p className="stat-value">{totalJobs}</p>
                            </div>
                            <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                <Layers size={24} />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <h3>Active Jobs</h3>
                                <p className="stat-value">{activeJobs}</p>
                            </div>
                            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                                <CheckCircle size={24} />
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <h3>Paused Jobs</h3>
                                <p className="stat-value">{pausedJobs}</p>
                            </div>
                            <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                                <XCircle size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className="search-bar">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search jobs by name or group..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    {/* Jobs Section */}
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Scheduled Jobs</h3>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {filteredTriggers.length} {filteredTriggers.length === 1 ? 'job' : 'jobs'}
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                            <p>Loading jobs...</p>
                        </div>
                    ) : filteredTriggers.length > 0 ? (
                        <TriggerList
                            triggers={filteredTriggers}
                            onRefresh={fetchTriggers}
                            onEdit={handleEditJob}
                            onView={handleViewJob}
                            onViewHistory={handleViewHistory}
                        />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <Layers size={32} color="var(--text-muted)" />
                            </div>
                            <h3>No jobs found</h3>
                            <p>
                                {searchTerm
                                    ? `No jobs match "${searchTerm}". Try a different search term.`
                                    : 'Get started by creating your first scheduled job'}
                            </p>
                            {!searchTerm && (
                                <button className="btn btn-primary" onClick={handleCreateJob} style={{ marginTop: '1rem' }}>
                                    <Plus size={18} />
                                    Create Job
                                </button>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
