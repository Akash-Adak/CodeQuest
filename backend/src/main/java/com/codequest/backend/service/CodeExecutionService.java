package com.codequest.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class CodeExecutionService {

    private final WebClient webClient;

    public CodeExecutionService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://judge0-ce.p.rapidapi.com").build();
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
                "stdin", input == null ? "" : input // custom input (e.g., "5\n10")
        );

        return webClient.post()
                .uri("/submissions?base64_encoded=false&wait=true")
                .header("X-RapidAPI-Key", "b8b5834c78mshcae26a3d5fc1161p103cc7jsn326ed2638a48")
                .header("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com")
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
