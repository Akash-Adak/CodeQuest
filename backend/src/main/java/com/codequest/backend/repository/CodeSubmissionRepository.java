package com.codequest.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.codequest.backend.model.CodeSubmission;

@Repository
public interface CodeSubmissionRepository extends MongoRepository<CodeSubmission, String> {
    List<CodeSubmission> findByRoomIdAndParticipant(String roomId, String participant);
}
