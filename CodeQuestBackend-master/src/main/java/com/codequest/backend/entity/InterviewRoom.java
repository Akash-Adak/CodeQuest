package com.codequest.backend.entity;

//import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "interview_rooms")
@Data
@AllArgsConstructor
public class InterviewRoom {

    @Id
    private ObjectId id;

    private String roomCode;

    private String accessCode;

    private Set<String> participantUsernames = new HashSet<>();

    public InterviewRoom() {}

    public InterviewRoom(String roomCode, String accessCode) {
        this.roomCode = roomCode;
        this.accessCode = accessCode;
    }



}
