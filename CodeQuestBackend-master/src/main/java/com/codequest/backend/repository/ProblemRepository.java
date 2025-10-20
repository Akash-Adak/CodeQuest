package com.codequest.backend.repository;

//import com.codequest.model.Problem;
import com.codequest.backend.entity.Problem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends MongoRepository<Problem, String> {
}
