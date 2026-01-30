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

package com.ppuskar.quartzmanager.repository;

import com.ppuskar.quartzmanager.entity.ExecutionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExecutionLogRepository extends JpaRepository<ExecutionLog, Long> {

    List<ExecutionLog> findByJobGroupAndJobNameOrderByFireTimeDesc(String jobGroup, String jobName);

    Page<ExecutionLog> findByJobGroupAndJobNameOrderByFireTimeDesc(String jobGroup, String jobName, Pageable pageable);

    @Modifying
    @Query("DELETE FROM ExecutionLog e WHERE e.fireTime < :cutoff")
    void deleteOlderThan(LocalDateTime cutoff);
}
