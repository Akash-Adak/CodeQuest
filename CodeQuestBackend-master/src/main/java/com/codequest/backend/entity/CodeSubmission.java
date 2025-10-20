package com.codequest.backend.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "code_submissions")
public class CodeSubmission {

    @Id
    private ObjectId id;

    private String roomId;

    private String participant;

    private String code;

    private LocalDateTime submittedAt;


}
