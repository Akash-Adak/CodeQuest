package com.codequest.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.codequest.backend.entity.CodeSubmission;
import com.codequest.backend.repository.CodeSubmissionRepository;
import com.codequest.backend.repository.RoomRepository;

@Controller
public class WebSocketController {

    @Autowired
    private CodeSubmissionRepository codeSubmissionRepository;

    @Autowired
    private RoomRepository roomRepository;

    @MessageMapping("/code/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Map<String, String> broadcastCode(@Payload Map<String, String> payload) {
        System.out.println("Received Code for Room: " + payload.get("roomId"));
        return payload; // Simply return the same payload (roomId, content)
    }

    @MessageMapping("/room/{roomId}/join")
    @SendTo("/topic/room/{roomId}/participants")
    public Map<String, Object> notifyJoin(@Payload Map<String, String> payload) {
        System.out.println("User joined room: " + payload.get("roomId") + ", participant: " + payload.get("participant"));
        String roomId = payload.get("roomId");
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("participant", payload.get("participant"));
        roomRepository.findById(roomId).ifPresent(room -> {
            response.put("participants", room.getParticipants());
            response.put("currentProblem", room.getCurrentProblem());
        });
        return response;
    }

    @MessageMapping("/room/{roomId}/leave")
    @SendTo("/topic/room/{roomId}/participants")
    public Map<String, String> notifyLeave(@Payload Map<String, String> payload) {
        System.out.println("User left room: " + payload.get("roomId") + ", participant: " + payload.get("participant"));
        return payload;
    }

    @MessageMapping("/room/{roomId}/problem")
    @SendTo("/topic/room/{roomId}/problem")
    public Map<String, String> shareProblem(@Payload Map<String, String> payload) {
        System.out.println("Problem shared in room: " + payload.get("roomId"));
        String roomId = payload.get("roomId");
        String problem = payload.get("problem");
        roomRepository.findById(roomId).ifPresent(room -> {
            room.setCurrentProblem(problem);
            roomRepository.save(room);
        });
        return payload;
    }

    @MessageMapping("/code/{roomId}/submit")
    public void saveCodeSubmission(@Payload Map<String, String> payload) {
        String roomId = payload.get("roomId");
        String participant = payload.get("participant");
        String code = payload.get("content");
        System.out.println("Saving code submission for room: " + roomId + ", participant: " + participant);
        CodeSubmission submission = new CodeSubmission(roomId, participant, code, LocalDateTime.now());
        codeSubmissionRepository.save(submission);
    }

    // New chat message handler
    @MessageMapping("/room/{roomId}/chat")
    @SendTo("/topic/room/{roomId}/chat")
    public Map<String, String> chatMessage(@Payload Map<String, String> payload) {
        System.out.println("Chat message in room: " + payload.get("roomId") + " from " + payload.get("participant") + ": " + payload.get("message"));
        return payload;
    }
}
