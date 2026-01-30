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

package com.example.quartzmanager.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Component
public class HttpJob implements Job {

    private static final Logger logger = LoggerFactory.getLogger(HttpJob.class);
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            var jobDataMap = context.getMergedJobDataMap();
            String url = jobDataMap.getString("url");
            String method = jobDataMap.getString("method");
            String body = jobDataMap.getString("body");

            if (url == null || method == null) {
                logger.error("URL or Method not specified in JobDataMap");
                return;
            }

            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(url));

            switch (method.toUpperCase()) {
                case "POST":
                    builder.POST(HttpRequest.BodyPublishers.ofString(body != null ? body : ""));
                    break;
                case "PUT":
                    builder.PUT(HttpRequest.BodyPublishers.ofString(body != null ? body : ""));
                    break;
                case "DELETE":
                    builder.DELETE();
                    break;
                case "GET":
                default:
                    builder.GET();
                    break;
            }

            // Headers
            jobDataMap.forEach((k, v) -> {
                if (k.startsWith("header.")) {
                    builder.header(k.substring(7), v.toString());
                }
            });

            HttpRequest request = builder.build();
            logger.info("Executing HTTP Job: {} {}", method, url);

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            logger.info("Job executed. Status: {}, Body: {}", response.statusCode(), response.body());

        } catch (Exception e) {
            logger.error("Error executing HTTP Job", e);
            throw new JobExecutionException(e);
        }
    }
}
