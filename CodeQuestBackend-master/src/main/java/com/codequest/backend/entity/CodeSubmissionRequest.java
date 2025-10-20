package com.codequest.backend.entity;

import lombok.Data;

@Data
public class CodeSubmissionRequest {
    private Long problemId;
    private String code;
    private String languageId;

    // Getters and setters
}
