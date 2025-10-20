package com.codequest.backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    private String id; // MongoDB uses String or ObjectId as id

    private String name;
    private String email;
    private String dob;      // Preferably use LocalDate if mapping correctly
    private String city;
    private String gender;
    private String linkedin;
    private String github;
    private String profilePhotoBase64; // Store base64 string directly

    public UserProfile(String username, String email) {
        this.name=username;
        this.email=email;
    }
}
