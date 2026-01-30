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

package com.example.quartzmanager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "execution_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobName;
    private String jobGroup;
    private String triggerName;
    private String triggerGroup;

    private LocalDateTime fireTime;
    private LocalDateTime endTime;
    private Long duration; // in milliseconds

    @Enumerated(EnumType.STRING)
    private ExecutionStatus status;

    @Column(length = 4096)
    private String message; // Error message or success result

    public enum ExecutionStatus {
        SUCCESS,
        FAILURE,
        VETOED
    }
}
