package com.codequest.backend.entity;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rooms")
public class Room {

    @Id
    private String id;

    private String name;

    private Set<String> participants = new HashSet<>();

    private String currentProblem;

    public Room() {
    }

    public Room(String name) {
        this.name = name;
    }

    public Room(String name, String createdBy) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<String> participants) {
        this.participants = participants;
    }

    public void addParticipant(String participant) {
        this.participants.add(participant);
    }

    public void removeParticipant(String participant) {
        this.participants.remove(participant);
    }

    public String getCurrentProblem() {
        return currentProblem;
    }

    public void setCurrentProblem(String currentProblem) {
        this.currentProblem = currentProblem;
    }
}