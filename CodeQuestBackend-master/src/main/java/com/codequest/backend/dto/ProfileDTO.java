package com.codequest.backend.dto;

import lombok.Data;

@Data
public class ProfileDTO {
    private String name;
    private String dob;
    private String city;
    private String gender;
    private String email;
    private String profilePicUrl;
}
