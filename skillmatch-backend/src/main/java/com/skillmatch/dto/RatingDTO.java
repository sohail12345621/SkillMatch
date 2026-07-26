package com.skillmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingDTO {

    private Long id;
    private Long sessionId;
    private Long raterId;
    private String raterName;
    private Long rateeId;
    private String rateeName;
    private Integer score;
    private String feedback;
    private LocalDateTime createdAt;
}
