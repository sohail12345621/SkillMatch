package com.skillmatch.dto;

import com.skillmatch.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchDTO {

    private Long id;

    private Long requesterId;
    private String requesterName;
    private String requesterEmail;
    private String requesterProfilePicture;
    private String requesterCollege;
    private Double requesterRating;

    private Long responderId;
    private String responderName;
    private String responderEmail;
    private String responderProfilePicture;
    private String responderCollege;
    private Double responderRating;

    private String requesterSkill;
    private String responderSkill;

    private MatchStatus status;
    private LocalDateTime createdAt;
}
