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

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TriggerInfo {
    private String triggerName;
    private String triggerGroup;
    private String cronExpression;
    private String lastExecutionTime;
    private String nextExecutionTime;
    private String jobName;
    private String jobGroup;
    private String description;
    private java.util.Map<String, Object> jobDataMap;
    private String state;
}
