package com.codequest.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.codequest.backend.entity.Room;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
}
