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

import com.example.quartzmanager.dto.JobRequest;
import com.example.quartzmanager.dto.TriggerInfo;
import com.example.quartzmanager.job.HttpJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {

    private final Scheduler scheduler;
    private static final DateTimeFormatter DNF = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
            .withZone(ZoneId.systemDefault());

    public void scheduleJob(JobRequest jobRequest) throws SchedulerException {
        log.info("Request to schedule job: {}/{}", jobRequest.getJobGroup(), jobRequest.getJobName());

        JobDataMap jobDataMap = new JobDataMap();
        if (jobRequest.getJobDataMap() != null) {
            jobDataMap.putAll(jobRequest.getJobDataMap());
        }

        JobDetail jobDetail = JobBuilder.newJob(HttpJob.class)
                .withIdentity(jobRequest.getJobName(), jobRequest.getJobGroup())
                .withDescription(jobRequest.getDescription())
                .usingJobData(jobDataMap)
                .storeDurably()
                .build();

        TriggerBuilder<CronTrigger> triggerBuilder = TriggerBuilder.newTrigger()
                .withIdentity(jobRequest.getJobName() + "_trigger", jobRequest.getJobGroup())
                .forJob(jobDetail)
                .withSchedule(CronScheduleBuilder.cronSchedule(jobRequest.getCronExpression()));

        if (jobRequest.getStartTime() != null) {
            triggerBuilder.startAt(Date.from(Instant.ofEpochMilli(jobRequest.getStartTime())));
        } else {
            triggerBuilder.startNow();
        }

        if (jobRequest.getEndTime() != null) {
            triggerBuilder.endAt(Date.from(Instant.ofEpochMilli(jobRequest.getEndTime())));
        }

        if (scheduler.checkExists(jobDetail.getKey())) {
            log.info("Updating existing job: {}/{}", jobRequest.getJobGroup(), jobRequest.getJobName());
            Set<Trigger> triggers = new HashSet<>();
            triggers.add(triggerBuilder.build());
            scheduler.scheduleJob(jobDetail, triggers, true);
        } else {
            log.info("Creating new job: {}/{}", jobRequest.getJobGroup(), jobRequest.getJobName());
            scheduler.scheduleJob(jobDetail, triggerBuilder.build());
        }
    }

    public List<TriggerInfo> getAllTriggers() throws SchedulerException {
        log.debug("Fetching all job triggers");
        List<TriggerInfo> triggerInfoList = new ArrayList<>();

        for (String groupName : scheduler.getJobGroupNames()) {
            for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals(groupName))) {
                JobDetail jobDetail = scheduler.getJobDetail(jobKey);
                List<? extends Trigger> triggers = scheduler.getTriggersOfJob(jobKey);

                for (Trigger trigger : triggers) {
                    Trigger.TriggerState triggerState = scheduler.getTriggerState(trigger.getKey());

                    String cronExpression = "";
                    if (trigger instanceof CronTrigger) {
                        cronExpression = ((CronTrigger) trigger).getCronExpression();
                    }

                    triggerInfoList.add(TriggerInfo.builder()
                            .jobName(jobKey.getName())
                            .jobGroup(jobKey.getGroup())
                            .triggerName(trigger.getKey().getName())
                            .triggerGroup(trigger.getKey().getGroup())
                            .description(jobDetail.getDescription())
                            .cronExpression(cronExpression)
                            .lastExecutionTime(trigger.getPreviousFireTime() != null
                                    ? DNF.format(trigger.getPreviousFireTime().toInstant())
                                    : "Never")
                            .nextExecutionTime(trigger.getNextFireTime() != null
                                    ? DNF.format(trigger.getNextFireTime().toInstant())
                                    : "Completed")
                            .jobDataMap(jobDetail.getJobDataMap().getWrappedMap())
                            .state(triggerState.name())
                            .build());
                }
            }
        }
        return triggerInfoList;
    }

    public List<String> getAllJobGroups() throws SchedulerException {
        log.debug("Fetching all job groups");
        List<String> jobGroups = new ArrayList<>(scheduler.getJobGroupNames());
        return jobGroups;
    }

    public void deleteJob(String group, String name) throws SchedulerException {
        log.info("Deleting job: {}/{}", group, name);
        scheduler.deleteJob(new JobKey(name, group));
    }
}
