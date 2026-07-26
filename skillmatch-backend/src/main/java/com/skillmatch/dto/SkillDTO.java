package com.skillmatch.dto;

import com.skillmatch.enums.ProficiencyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDTO {

    private Long id;

    @NotBlank(message = "Skill name is required")
    @Size(max = 100, message = "Skill name must be under 100 characters")
    private String skillName;

    private ProficiencyLevel proficiencyLevel;

    @Size(max = 500, message = "Description must be under 500 characters")
    private String description;

    private Long userId;
    private String userName;
}
