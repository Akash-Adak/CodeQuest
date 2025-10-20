package com.codequest.backend.service;

import com.codequest.backend.entity.UserProfile;

import java.util.Optional;

public interface UserProfileService {
    Optional<UserProfile> findByEmail(String email);
    UserProfile save(UserProfile profile);
}
