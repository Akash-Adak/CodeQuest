package com.codequest.backend.entity;

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "interview_rooms")
public class InterviewRoom {

    @Id
    private String id;

    private String roomCode;

    private String accessCode;

    private Set<String> participantUsernames = new HashSet<>();

    public InterviewRoom() {}

    public InterviewRoom(String roomCode, String accessCode) {
        this.roomCode = roomCode;
        this.accessCode = accessCode;
    }

    public String getId() {
        return id;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getAccessCode() {
        return accessCode;
    }

    public void setAccessCode(String accessCode) {
        this.accessCode = accessCode;
    }

    public Set<String> getParticipantUsernames() {
        return participantUsernames;
    }

    public void setParticipantUsernames(Set<String> participantUsernames) {
        this.participantUsernames = participantUsernames;
    }

    public void addParticipant(String username) {
        this.participantUsernames.add(username);
    }
}
