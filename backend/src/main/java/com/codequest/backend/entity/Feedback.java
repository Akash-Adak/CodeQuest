package com.codequest.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "feedback")
public class Feedback {

    @Id
    private String id;

    private String roomId;
    private String participant;
    private int rating;
    private String comments;

    public Feedback() {}

    public Feedback(String roomId, String participant, int rating, String comments) {
        this.roomId = roomId;
        this.participant = participant;
        this.rating = rating;
        this.comments = comments;
    }

    // Getters and setters

    public String getId() {
        return id;
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

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
