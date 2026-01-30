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

package com.example.quartzmanager.controller;

import com.example.quartzmanager.dto.JobRequest;
import com.example.quartzmanager.dto.TriggerInfo;
import com.example.quartzmanager.service.SchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow for development
@Slf4j
public class SchedulerController {

    private final SchedulerService schedulerService;

    @PostMapping
    public ResponseEntity<String> scheduleJob(@RequestBody JobRequest jobRequest) {
        log.info("Received request to schedule job: name={}, group={}", jobRequest.getJobName(),
                jobRequest.getJobGroup());
        try {
            schedulerService.scheduleJob(jobRequest);
            return ResponseEntity.ok("Job scheduled successfully");
        } catch (SchedulerException e) {
            log.error("Error scheduling job", e);
            return ResponseEntity.internalServerError().body("Error scheduling job: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<TriggerInfo>> getAllJobs() {
        log.info("Received request to get all jobs");
        try {
            return ResponseEntity.ok(schedulerService.getAllTriggers());
        } catch (SchedulerException e) {
            log.error("Error getting all jobs", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/groups")
    public ResponseEntity<List<String>> getAllJobGroups() {
        log.info("Received request to get all job groups");
        try {
            return ResponseEntity.ok(schedulerService.getAllJobGroups());
        } catch (SchedulerException e) {
            log.error("Error getting job groups", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{group}/{name}")
    public ResponseEntity<String> deleteJob(@PathVariable String group, @PathVariable String name) {
        log.info("Received request to delete job: group={}, name={}", group, name);
        try {
            schedulerService.deleteJob(group, name);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (SchedulerException e) {
            log.error("Error deleting job", e);
            return ResponseEntity.internalServerError().body("Error deleting job: " + e.getMessage());
        }
    }
}
