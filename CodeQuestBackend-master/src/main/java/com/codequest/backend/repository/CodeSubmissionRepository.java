package com.codequest.backend.repository;

import java.io.ObjectInput;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.codequest.backend.entity.CodeSubmission;

@Repository
public interface CodeSubmissionRepository extends MongoRepository<CodeSubmission, ObjectId> {
    List<CodeSubmission> findByRoomIdAndParticipant(String roomId, String participant);
}
