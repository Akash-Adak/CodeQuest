package com.codequest.backend.entity;

// import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "session")
public class Session {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private ObjectId id;

    private String roomId;
    private String username;
    private LocalDateTime timestamp;

    // Constructors, Getters, Setters
}
