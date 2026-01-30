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

package com.example.quartzmanager.config;

import com.example.quartzmanager.listener.ExecutionHistoryListener;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class QuartzConfig {

    private final Scheduler scheduler;
    private final ExecutionHistoryListener executionHistoryListener;

    @PostConstruct
    public void init() {
        try {
            scheduler.getListenerManager().addJobListener(executionHistoryListener);
            log.info("Registered ExecutionHistoryListener");
        } catch (SchedulerException e) {
            log.error("Failed to register ExecutionHistoryListener", e);
        }
    }
}
