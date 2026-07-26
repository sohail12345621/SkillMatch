package com.skillmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private String bio;
    private String college;
    private String profilePicture;
    private String availability;
    private Double averageRating;
    private Integer totalRatings;
    private List<SkillDTO> skillsOffered;
    private List<SkillDTO> skillsWanted;
    private LocalDateTime createdAt;
}
