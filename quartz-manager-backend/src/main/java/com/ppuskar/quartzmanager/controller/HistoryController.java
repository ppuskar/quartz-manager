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

package com.ppuskar.quartzmanager.controller;

import com.ppuskar.quartzmanager.entity.ExecutionLog;
import com.ppuskar.quartzmanager.repository.ExecutionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HistoryController {

    private final ExecutionLogRepository executionLogRepository;

    @GetMapping("/{group}/{name}")
    public ResponseEntity<List<ExecutionLog>> getJobHistory(
            @PathVariable String group,
            @PathVariable String name) {
        // Return last 20 executions by default for simple list view
        // For full pagination we can add parameters, but this should suffice for the UI
        // modal
        return ResponseEntity.ok(
                executionLogRepository.findByJobGroupAndJobNameOrderByFireTimeDesc(group, name)
                        .stream().limit(20).toList());
    }
}
