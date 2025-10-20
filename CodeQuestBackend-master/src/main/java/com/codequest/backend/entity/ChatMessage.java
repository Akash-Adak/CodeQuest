package com.codequest.backend.entity;

import lombok.Data;

@Data
public class ChatMessage {
    private String from;
    private String content;
}
