package com.codequest.backend.service;

import com.codequest.backend.entity.Room;
import com.codequest.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room createRoom(String roomName, String createdBy) {
        Room room = new Room(roomName, createdBy);
        return roomRepository.save(room);
    }
}

