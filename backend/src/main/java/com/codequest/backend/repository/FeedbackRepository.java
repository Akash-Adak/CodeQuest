package com.codequest.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.codequest.backend.entity.Feedback;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
}
