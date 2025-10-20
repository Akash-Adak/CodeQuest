package com.codequest.backend.controller;

import com.codequest.backend.entity.TempUser;
import com.codequest.backend.entity.User;
import com.codequest.backend.entity.UserProfile;
import com.codequest.backend.repository.UserProfileRepository;
import com.codequest.backend.repository.UserRepository;
import com.codequest.backend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository profileRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Store temp users waiting for email verification
    private Map<String, TempUser> pendingUsers = new HashMap<>();

    private void sendVerificationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("CodeQuest Email Verification");
        message.setText(
                "Dear User,\n\n" +
                        "Thank you for signing up with CodeQuest!\n\n" +
                        "To complete your registration, please verify your email address using the verification code below:\n\n" +
                        "🔒 Verification Code: " + code + "\n\n" +
                        "Please enter this code in the verification page to activate your account.\n" +
                        "Note: This code is valid for a limited time. Do not share it with anyone.\n\n" +
                        "If you did not initiate this request, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "The CodeQuest Team\n" +
                        "https://codequest.io"
        );

        mailSender.send(message);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> userMap) {
        String username = userMap.get("username");
        String password = userMap.get("password");
        String email = userMap.get("email");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Generate 6-digit verification code
        String code = String.valueOf(new Random().nextInt(900000) + 100000);
        sendVerificationCode(email, code);

        TempUser tempUser = new TempUser(username, password, email, code);
        pendingUsers.put(email, tempUser);

        return ResponseEntity.ok("Verification code sent to your email.");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        TempUser tempUser = pendingUsers.get(email);
        if (tempUser == null || !tempUser.getCode().equals(code)) {
            return ResponseEntity.badRequest().body("Invalid or expired verification code.");
        }

        // Create User and Profile
        String encodedPassword = passwordEncoder.encode(tempUser.getPassword());
        User user = new User(tempUser.getUsername(), encodedPassword, email, "ROLE_USER");
        userRepository.save(user);

        UserProfile profile = new UserProfile(tempUser.getUsername(), email);
        profileRepository.save(profile);

        String token = jwtUtil.generateToken(tempUser.getUsername());

        // Remove user from pending map
        pendingUsers.remove(email);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> userMap) {
        String username = userMap.get("username");
        String password = userMap.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        String token = jwtUtil.generateToken(username);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/forget")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> userMap) {
        String username = userMap.get("username");
        String password = userMap.get("password");
        String email = userMap.get("email");

        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (!user.getEmail().equals(email)) {
                return ResponseEntity.badRequest().body("Email does not match the registered email.");
            }
            String encodedPassword = passwordEncoder.encode(password);
            user.setPassword(encodedPassword);
            userRepository.save(user);
            return ResponseEntity.ok("Password updated successfully.");
        } else {
            return ResponseEntity.badRequest().body("Username does not exist.");
        }
    }

    @DeleteMapping("/del")
    public ResponseEntity<?> deleteAll() {
        userRepository.deleteAll();
        return ResponseEntity.ok().build();
    }
}
