package com.codequest.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "code_submissions")
public class CodeSubmission {

    @Id
    private String id;

    private String roomId;

    private String participant;

    private String code;

    private LocalDateTime submittedAt;

    public CodeSubmission() {
    }

    public CodeSubmission(String roomId, String participant, String code, LocalDateTime submittedAt) {
        this.roomId = roomId;
        this.participant = participant;
        this.code = code;
        this.submittedAt = submittedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getParticipant() {
        return participant;
    }

    public void setParticipant(String participant) {
        this.participant = participant;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
