package com.codequest.backend.controller;

import com.codequest.backend.service.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/execute")
public class CodeExecutionController {

    @Autowired
    private CodeExecutionService codeExecutionService;

    @PostMapping
    public Mono<ResponseEntity<Map<String, String>>> executeCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String languageId = payload.get("languageId"); // Judge0 uses numeric IDs

        return codeExecutionService.executeCode(code, languageId)
                .map(output -> ResponseEntity.ok(Map.of("output", output)))
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }
}
