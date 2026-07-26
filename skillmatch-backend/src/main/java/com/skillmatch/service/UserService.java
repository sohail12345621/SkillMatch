package com.skillmatch.service;

import com.skillmatch.dto.SkillDTO;
import com.skillmatch.dto.UpdateProfileRequest;
import com.skillmatch.dto.UserDTO;
import com.skillmatch.entity.User;
import com.skillmatch.exception.ResourceNotFoundException;
import com.skillmatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public UserDTO getUserById(Long id) {
        User user = findUserOrThrow(id);
        return mapToDTO(user);
    }

    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToDTO(user);
    }

    @Transactional
    public UserDTO updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getCollege() != null) {
            user.setCollege(request.getCollege());
        }
        if (request.getAvailability() != null) {
            user.setAvailability(request.getAvailability());
        }

        user = userRepository.save(user);
        return mapToDTO(user);
    }

    @Transactional
    public UserDTO uploadProfilePicture(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // Delete old picture if exists
        if (user.getProfilePicture() != null) {
            fileStorageService.deleteFile(user.getProfilePicture());
        }

        String fileUrl = fileStorageService.storeFile(file);
        user.setProfilePicture(fileUrl);
        user = userRepository.save(user);
        return mapToDTO(user);
    }

    public List<UserDTO> searchUsers(String query) {
        List<User> users = userRepository
                .findByNameContainingIgnoreCaseOrCollegeContainingIgnoreCase(query, query);
        return users.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // ===== Helper Methods =====

    public User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public UserDTO mapToDTO(User user) {
        List<SkillDTO> offeredDTOs = user.getSkillsOffered().stream()
                .map(s -> SkillDTO.builder()
                        .id(s.getId())
                        .skillName(s.getSkillName())
                        .proficiencyLevel(s.getProficiencyLevel())
                        .description(s.getDescription())
                        .userId(user.getId())
                        .userName(user.getName())
                        .build())
                .collect(Collectors.toList());

        List<SkillDTO> wantedDTOs = user.getSkillsWanted().stream()
                .map(s -> SkillDTO.builder()
                        .id(s.getId())
                        .skillName(s.getSkillName())
                        .proficiencyLevel(s.getDesiredLevel())
                        .description(s.getDescription())
                        .userId(user.getId())
                        .userName(user.getName())
                        .build())
                .collect(Collectors.toList());

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .bio(user.getBio())
                .college(user.getCollege())
                .profilePicture(user.getProfilePicture())
                .availability(user.getAvailability())
                .averageRating(user.getAverageRating())
                .totalRatings(user.getTotalRatings())
                .skillsOffered(offeredDTOs)
                .skillsWanted(wantedDTOs)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
