package com.codequest.backend.entity;

import lombok.Data;

@Data
public class TempUser {
    private String username;
    private String password;
    private String email;
    private String code;

    public TempUser(String username, String password, String email, String code) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.code = code;
    }

    // Getters
}
