// src/main/java/com/codequest/backend/controller/TypingController.java
package com.codequest.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class TypingController {

    @MessageMapping("/typing/{roomId}")
    @SendTo("/topic/typing/{roomId}")
    public Map<String, Object> broadcastTypingStatus(@Payload Map<String, Object> payload) {
        System.out.println("Typing Status for Room: " + payload.get("roomId") + " Typing: " + payload.get("typing"));
        return payload;
    }
}
