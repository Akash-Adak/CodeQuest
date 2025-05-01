package com.codequest.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.codequest.backend.entity.User;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
}
