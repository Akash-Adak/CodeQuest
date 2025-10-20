package com.codequest.backend.controller;

import com.codequest.backend.entity.InterviewRoom;
import com.codequest.backend.repository.InterviewRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/interview-rooms")
public class InterviewRoomController {

    @Autowired
    private InterviewRoomRepository interviewRoomRepository;

    @PostMapping("/create")
    public ResponseEntity<InterviewRoom> createRoom() {
        String roomCode = UUID.randomUUID().toString().substring(0, 8);
        String accessCode = generateRandomAccessCode(6); // auto-generate 6-character code
        InterviewRoom room = new InterviewRoom(roomCode, accessCode);
        interviewRoomRepository.save(room);
        return ResponseEntity.ok(room);
    }

    private String generateRandomAccessCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
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

        room.getParticipantUsernames().add(username);  // Allow multiple participants
        interviewRoomRepository.save(room);

        return ResponseEntity.ok("Joined room successfully");
    }
    @GetMapping("/{roomCode}/participants")
    public ResponseEntity<?> getParticipants(@PathVariable String roomCode) {
        Optional<InterviewRoom> roomOpt = interviewRoomRepository.findByRoomCode(roomCode);
        if (roomOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Room not found");
        }
        return ResponseEntity.ok(roomOpt.get().getParticipantUsernames());
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAll(){
       interviewRoomRepository.deleteAll();
       return new ResponseEntity<>(HttpStatus.GONE);
    }
}
