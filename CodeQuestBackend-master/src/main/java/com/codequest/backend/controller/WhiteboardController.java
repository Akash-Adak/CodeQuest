package com.codequest.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WhiteboardController {

    @MessageMapping("/drawing")
    @SendTo("/topic/drawing")
    public String handleDrawingMessage(String message) throws Exception {
        // Simply broadcast the received message to all subscribers
        return message;
    }
}
