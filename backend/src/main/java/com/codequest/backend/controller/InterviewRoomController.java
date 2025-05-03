package com.codequest.backend.controller;

import com.codequest.backend.entity.InterviewRoom;
import com.codequest.backend.repository.InterviewRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/interview-rooms")
public class InterviewRoomController {

    @Autowired
    private InterviewRoomRepository interviewRoomRepository;

    @PostMapping("/create")
    public ResponseEntity<InterviewRoom> createRoom(@RequestParam String accessCode) {
        String roomCode = UUID.randomUUID().toString();
        InterviewRoom room = new InterviewRoom(roomCode, accessCode);
        interviewRoomRepository.save(room);
        return ResponseEntity.ok(room);
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinRoom(@RequestParam String roomCode, @RequestParam String accessCode, @RequestParam String username) {
        Optional<InterviewRoom> roomOpt = interviewRoomRepository.findByRoomCode(roomCode);
        if (roomOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Room not found");
        }
       InterviewRoom room = roomOpt.get();
        if (!room.getAccessCode().equals(accessCode)) {
            return ResponseEntity.status(403).body("Invalid access code");
        }
        room.addParticipant(username);
        interviewRoomRepository.save(room);
        return ResponseEntity.ok("Joined room successfully");
    }
}
