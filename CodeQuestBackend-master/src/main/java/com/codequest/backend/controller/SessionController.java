package com.codequest.backend.controller;

import com.codequest.backend.entity.Session;
//import com.codequest.backend.repository.SessionRepository;
import com.codequest.backend.repository.InterviewRoomRepository;
import com.codequest.backend.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")

public class SessionController {

    @Autowired
    private SessionRepository sessionRepository;

    @PostMapping
    public ResponseEntity<Session> saveSession(@RequestBody Session session) {
        session.setTimestamp(LocalDateTime.now());
        return ResponseEntity.ok(sessionRepository.save(session));
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<Session>> getUserSessions(@PathVariable String username) {
        List<Session> session=sessionRepository.findByUsernameOrderByTimestampDesc(username);
        if(session.isEmpty()){
            System.out.println("not any thinhg");
        }
        return ResponseEntity.ok(session);
    }
}
