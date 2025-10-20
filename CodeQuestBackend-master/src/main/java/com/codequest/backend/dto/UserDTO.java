package com.codequest.backend.dto;

//import io.swagger.v3.oas.annotations.media.Schema;
//import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


//import javax.validation.constraints.NotEmpty;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {


    //    @Schema(description = "The user's username")
//    private Long id;
    @NotNull
//    @Schema(description = "The user's username")
    private String userName;
    private String email;
    private boolean sentimentAnalysis;
    @NotNull
    private String password;
}