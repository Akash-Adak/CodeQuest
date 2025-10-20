package com.codequest.backend.repository;

import com.codequest.backend.entity.Session;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends MongoRepository<Session, ObjectId> {
    List<Session> findByUsernameOrderByTimestampDesc(String username);
}