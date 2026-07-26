package com.skillmatch.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 150)
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;

    @Size(max = 500)
    @Column(length = 500)
    private String bio;

    @Size(max = 200)
    @Column(length = 200)
    private String college;

    @Column(length = 500)
    private String profilePicture;

    @Size(max = 200)
    @Column(length = 200)
    private String availability;

    @Column(nullable = false)
    @Builder.Default
    private Double averageRating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalRatings = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ===== Relationships =====

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SkillOffered> skillsOffered = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SkillWanted> skillsWanted = new ArrayList<>();

    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Match> sentMatches = new ArrayList<>();

    @OneToMany(mappedBy = "responder", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Match> receivedMatches = new ArrayList<>();

    @OneToMany(mappedBy = "rater", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Rating> ratingsGiven = new ArrayList<>();

    @OneToMany(mappedBy = "ratee", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Rating> ratingsReceived = new ArrayList<>();
}
