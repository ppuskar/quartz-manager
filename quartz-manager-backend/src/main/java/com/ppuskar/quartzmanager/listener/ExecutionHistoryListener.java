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

package com.ppuskar.quartzmanager.listener;

import com.ppuskar.quartzmanager.entity.ExecutionLog;
import com.ppuskar.quartzmanager.repository.ExecutionLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
@RequiredArgsConstructor
@Slf4j
public class ExecutionHistoryListener implements JobListener {

    private final ExecutionLogRepository executionLogRepository;

    @Override
    public String getName() {
        return "ExecutionHistoryListener";
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
        // No-op
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {
        saveLog(context, ExecutionLog.ExecutionStatus.VETOED, "Job execution vetoed");
    }

    @Override
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
        if (jobException != null) {
            saveLog(context, ExecutionLog.ExecutionStatus.FAILURE, jobException.getMessage());
        } else {
            String result = String.valueOf(context.getResult());
            saveLog(context, ExecutionLog.ExecutionStatus.SUCCESS,
                    result != null && !result.equals("null") ? result : "Success");
        }
    }

    private void saveLog(JobExecutionContext context, ExecutionLog.ExecutionStatus status, String message) {
        try {
            Date fireTimeDate = context.getFireTime();
            LocalDateTime fireTime = LocalDateTime.ofInstant(fireTimeDate.toInstant(), ZoneId.systemDefault());

            long duration = context.getJobRunTime();
            LocalDateTime endTime = fireTime.plusNanos(duration * 1_000_000);

            ExecutionLog logRel = ExecutionLog.builder()
                    .jobName(context.getJobDetail().getKey().getName())
                    .jobGroup(context.getJobDetail().getKey().getGroup())
                    .triggerName(context.getTrigger().getKey().getName())
                    .triggerGroup(context.getTrigger().getKey().getGroup())
                    .fireTime(fireTime)
                    .endTime(endTime)
                    .duration(duration)
                    .status(status)
                    .message(message != null ? (message.length() > 4000 ? message.substring(0, 4000) + "..." : message)
                            : null)
                    .build();

            executionLogRepository.save(logRel);
        } catch (Exception e) {
            log.error("Failed to save execution log", e);
        }
    }
}
