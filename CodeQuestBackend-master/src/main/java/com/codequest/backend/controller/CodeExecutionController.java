package com.codequest.backend.controller;

import com.codequest.backend.service.CodeExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/code")
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    public CodeExecutionController(CodeExecutionService codeExecutionService) {
        this.codeExecutionService = codeExecutionService;
    }

    @PostMapping("/run")
    public Mono<ResponseEntity<Map<String, String>>> runCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String languageId = payload.get("languageId");
        String input = payload.getOrDefault("input", "");

        return codeExecutionService.executeCode(code, languageId, input)
                .map(output -> ResponseEntity.ok(Map.of("output", output)))
                .onErrorResume(e -> Mono.just(ResponseEntity
                        .badRequest()
                        .body(Map.of("error", e.getMessage()))));
    }

//    @PostMapping("/submit")
//    public Mono<CodeSubmissionResult> submitCode(@RequestBody CodeSubmissionRequest request) {
//        return codeExecutionService.evaluateSubmission(request);
//    }
}
