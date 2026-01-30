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

package com.ppuskar.quartzmanager.dto;

import lombok.Data;
import java.util.Map;

@Data
public class JobRequest {
    private String jobName;
    private String jobGroup;
    private String description;
    private String cronExpression;
    private Long startTime; // Epoch millis
    private Long endTime;   // Epoch millis
    private Map<String, String> jobDataMap;
}
