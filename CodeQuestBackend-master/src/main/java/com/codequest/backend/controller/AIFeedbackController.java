package com.codequest.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class AIFeedbackController {

    @PostMapping("/score")
    public ResponseEntity<Map<String, Object>> getFeedback(@RequestBody Map<String, Object> request) {
        // For now, return dummy feedback. This can be replaced with real AI integration.
        String code = (String) request.getOrDefault("code", "");
        String feedback = "This is a dummy AI feedback based on the submitted code length: " + code.length();

        return ResponseEntity.ok(Map.of(
                "score", 85,
                "feedback", feedback
        ));
    }
}
