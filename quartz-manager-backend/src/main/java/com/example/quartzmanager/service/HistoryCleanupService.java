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

package com.example.quartzmanager.service;

import com.example.quartzmanager.repository.ExecutionLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class HistoryCleanupService {

    private final ExecutionLogRepository executionLogRepository;

    @Value("${quartz.history.retention-days:10}")
    private int retentionDays;

    @Scheduled(cron = "0 0 0 * * ?") // Every day at midnight
    @Transactional
    public void cleanupOldLogs() {
        log.info("Starting execution history cleanup. Retention days: {}", retentionDays);
        if (retentionDays <= 0)
            return;

        LocalDateTime cutoff = LocalDateTime.now().minusDays(retentionDays);
        executionLogRepository.deleteOlderThan(cutoff);
        log.info("Cleanup completed. Deleted logs older than {}", cutoff);
    }
}
