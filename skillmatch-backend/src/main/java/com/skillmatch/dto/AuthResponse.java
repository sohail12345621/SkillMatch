package com.skillmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String type;
    private Long id;
    private String name;
    private String email;
    private String profilePicture;

    public static AuthResponse of(String token, Long id, String name, String email, String profilePicture) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(id)
                .name(name)
                .email(email)
                .profilePicture(profilePicture)
                .build();
    }
}
