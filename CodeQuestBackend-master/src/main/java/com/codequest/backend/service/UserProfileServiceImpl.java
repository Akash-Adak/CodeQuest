package com.codequest.backend.service;

import com.codequest.backend.entity.UserProfile;
import com.codequest.backend.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    @Autowired
    private UserProfileRepository repository;

    @Override
    public Optional<UserProfile> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public UserProfile save(UserProfile profile) {
        // Optionally, you can add logic here to check existing by email and update
        return repository.save(profile);
    }
}
