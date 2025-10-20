package com.codequest.backend.controller;

import com.codequest.backend.entity.User;
import com.codequest.backend.entity.UserProfile;
import com.codequest.backend.repository.UserRepository;
import com.codequest.backend.service.UserProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
// @CrossOrigin(origins = "*") // For development, allow all origins; restrict in prod
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;
    @Autowired
    private UserRepository userRepository;
    // GET profile by email
    @GetMapping
    public ResponseEntity<UserProfile> getProfileByEmail(@RequestParam String email) {
        Optional<UserProfile> profileOpt = userProfileService.findByEmail(email);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (profileOpt.isEmpty() && userOpt.isPresent()) {
            User user = userOpt.get();
            UserProfile userProfile = new UserProfile(user.getUsername(), user.getEmail());
            userProfileService.save(userProfile); // Save the newly created profile
            return ResponseEntity.ok(userProfile); // Return the newly created profile
        }

        return profileOpt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST save/update profile
    @PostMapping
    public ResponseEntity<UserProfile> saveOrUpdateProfile(@RequestBody UserProfile profile) {
        // If profile with this email exists, update that record (keep ID)
        Optional<UserProfile> existing = userProfileService.findByEmail(profile.getEmail());
        if (existing.isPresent()) {
            profile.setId(existing.get().getId());
        }
        UserProfile saved = userProfileService.save(profile);
        return ResponseEntity.ok(saved);
    }
}
