package com.codequest.backend.controller;

import com.codequest.backend.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage.{sessionId}")
    @SendTo("/topic/{sessionId}")
    public ChatMessage sendMessage(@DestinationVariable String sessionId, ChatMessage message) {
        return message;
    }
}
