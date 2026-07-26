package com.skillmatch.entity;

import com.skillmatch.enums.ProficiencyLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "skills_wanted")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillWanted {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Skill name is required")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String skillName;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private ProficiencyLevel desiredLevel = ProficiencyLevel.BEGINNER;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
