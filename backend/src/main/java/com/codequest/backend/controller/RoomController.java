package com.codequest.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codequest.backend.entity.Room;
import com.codequest.backend.repository.RoomRepository;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> createRoom(@RequestParam String name) {
        Room room = new Room(name);
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.ok(savedRoom);
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<String> joinRoom(@PathVariable String roomId, @RequestParam String participant) {
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isPresent()) {
            Room room = roomOpt.get();
            room.addParticipant(participant);
            roomRepository.save(room);
            return ResponseEntity.ok("Participant added");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{roomId}/participants")
    public ResponseEntity<Set<String>> getParticipants(@PathVariable String roomId) {
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isPresent()) {
            return ResponseEntity.ok(roomOpt.get().getParticipants());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadRecording(@RequestParam("file") MultipartFile file) {
        try {
            String filename = file.getOriginalFilename();
            Path path = Paths.get("uploads/" + filename); // or save to database/Cloud
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }

}
