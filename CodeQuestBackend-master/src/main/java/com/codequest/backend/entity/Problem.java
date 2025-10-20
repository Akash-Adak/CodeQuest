package com.codequest.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
//import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "problems")
public class Problem {

    @Id
    private String id;

    private String title;
    private String description;
    private String difficulty;

    @JsonProperty("testCases") // Ensures frontend can read `testCases` instead of `testcase`
    private List<String> testcase;

    @JsonProperty("testCases")
    public List<String> getTestCases() {
        return testcase;
    }

    @JsonProperty("testCases")
    public void setTestCases(List<String> testCases) {
        this.testcase = testCases;
    }

    public Problem(String id, String title, String description, String difficulty, List<String> testcase) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.testcase = testcase;
    }
}
