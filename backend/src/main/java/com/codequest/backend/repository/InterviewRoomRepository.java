package com.codequest.backend.repository;

import com.codequest.backend.entity.InterviewRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewRoomRepository extends MongoRepository<InterviewRoom, String> {
    Optional<InterviewRoom> findByRoomCode(String roomCode);
}
