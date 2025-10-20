package com.codequest.backend.repository;

import com.codequest.backend.entity.InterviewRoom;
import com.codequest.backend.entity.Session;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRoomRepository extends MongoRepository<InterviewRoom, ObjectId> {
    Optional<InterviewRoom> findByRoomCode(String roomCode);


}
