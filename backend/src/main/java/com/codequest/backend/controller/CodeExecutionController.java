  package com.codequest.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/execute")
public class CodeExecutionController {

    @PostMapping
    public ResponseEntity<Map<String, String>> executeCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String language = payload.get("language");

        // For MVP, simulate code execution by returning a dummy output
        String output = "Executed code in language: " + language + "\\nOutput: Hello World!";

        Map<String, String> response = new HashMap<>();
        response.put("output", output);

        return ResponseEntity.ok(response);
    }
}
