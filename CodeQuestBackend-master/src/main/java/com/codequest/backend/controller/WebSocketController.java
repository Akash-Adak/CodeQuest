package com.codequest.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/code/{roomId}")
    public void broadcastCode(@DestinationVariable String roomId, @Payload Map<String, String> payload) {
        // Broadcast the entire payload as is to support chat messages with "from" and "content"
        messagingTemplate.convertAndSend("/topic/code/" + roomId, payload);
    }
}
