package com.codequest.backend.service;

import com.codequest.backend.config.Judge0Properties;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class CodeExecutionService {

    private final WebClient webClient;
    private final Judge0Properties judge0Properties;

    public CodeExecutionService(WebClient.Builder webClientBuilder, Judge0Properties judge0Properties) {
        this.judge0Properties = judge0Properties;
        this.webClient = webClientBuilder.baseUrl(judge0Properties.getBaseUrl()).build();
    }

    public Mono<String> executeCode(String code, String languageId, String input) {
        int langId;

        try {
            langId = Integer.parseInt(languageId);
        } catch (NumberFormatException e) {
            return Mono.error(new IllegalArgumentException("Invalid language ID: " + languageId));
        }

        if (code == null || code.trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("Code cannot be empty"));
        }

        Map<String, Object> requestBody = Map.of(
                "source_code", code,
                "language_id", langId,
                "stdin", input == null ? "" : input
        );

        return webClient.post()
                .uri("/submissions?base64_encoded=false&wait=true")
                .header("X-RapidAPI-Key", judge0Properties.getKey())
                .header("X-RapidAPI-Host", judge0Properties.getHost())
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    System.out.println("API Response: " + response);

                    if (response.containsKey("stdout") && response.get("stdout") != null) {
                        return (String) response.get("stdout");
                    } else if (response.containsKey("compile_output") && response.get("compile_output") != null) {
                        return (String) response.get("compile_output");
                    } else if (response.containsKey("stderr") && response.get("stderr") != null) {
                        return (String) response.get("stderr");
                    } else {
                        return "No output or error returned from Judge0 API.";
                    }
                });
    }
}
