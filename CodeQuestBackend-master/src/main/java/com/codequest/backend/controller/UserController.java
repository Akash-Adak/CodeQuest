package com.codequest.backend.controller;

import com.codequest.backend.entity.User;
import com.codequest.backend.repository.UserRepository;
import com.codequest.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
//@RequestMapping(/user)
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String username= authentication.getName();
        User user= userRepository.findByUsername(username).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("username", authentication.getName());
//        response.put("authorities", authentication.getAuthorities());
        response.put("email",user.getEmail());

        return ResponseEntity.ok(response);
    }


}
