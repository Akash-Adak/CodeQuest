package com.codequest.backend.entity;

import lombok.Data;

@Data
public class DrawingEvent {
    private int x;
    private int y;
    private String tool;
    private String color;
    private int lineWidth;


}
