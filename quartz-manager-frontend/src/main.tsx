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

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './index.css' // Removed default

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
