package com.skillmatch.service;

import com.skillmatch.dto.SkillDTO;
import com.skillmatch.entity.SkillOffered;
import com.skillmatch.entity.SkillWanted;
import com.skillmatch.entity.User;
import com.skillmatch.enums.ProficiencyLevel;
import com.skillmatch.exception.BadRequestException;
import com.skillmatch.exception.ResourceNotFoundException;
import com.skillmatch.repository.SkillOfferedRepository;
import com.skillmatch.repository.SkillWantedRepository;
import com.skillmatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillOfferedRepository skillOfferedRepository;
    private final SkillWantedRepository skillWantedRepository;
    private final UserRepository userRepository;

    // ===== Skills Offered =====

    public List<SkillDTO> getOfferedSkills(Long userId) {
        return skillOfferedRepository.findByUserId(userId).stream()
                .map(this::mapOfferedToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDTO addOfferedSkill(String email, SkillDTO dto) {
        User user = findUserByEmail(email);
        String normalizedName = dto.getSkillName().trim();

        if (skillOfferedRepository.existsBySkillNameIgnoreCaseAndUserId(normalizedName, user.getId())) {
            throw new BadRequestException("You already offer this skill: " + normalizedName);
        }

        SkillOffered skill = SkillOffered.builder()
                .skillName(normalizedName)
                .proficiencyLevel(dto.getProficiencyLevel() != null
                        ? dto.getProficiencyLevel() : ProficiencyLevel.BEGINNER)
                .description(dto.getDescription())
                .user(user)
                .build();

        skill = skillOfferedRepository.save(skill);
        return mapOfferedToDTO(skill);
    }

    @Transactional
    public SkillDTO updateOfferedSkill(String email, Long skillId, SkillDTO dto) {
        User user = findUserByEmail(email);
        SkillOffered skill = skillOfferedRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        if (!skill.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only edit your own skills");
        }

        if (dto.getSkillName() != null && !dto.getSkillName().isBlank()) {
            skill.setSkillName(dto.getSkillName().trim());
        }
        if (dto.getProficiencyLevel() != null) {
            skill.setProficiencyLevel(dto.getProficiencyLevel());
        }
        if (dto.getDescription() != null) {
            skill.setDescription(dto.getDescription());
        }

        skill = skillOfferedRepository.save(skill);
        return mapOfferedToDTO(skill);
    }

    @Transactional
    public void deleteOfferedSkill(String email, Long skillId) {
        User user = findUserByEmail(email);
        SkillOffered skill = skillOfferedRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        if (!skill.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only delete your own skills");
        }

        skillOfferedRepository.delete(skill);
    }

    // ===== Skills Wanted =====

    public List<SkillDTO> getWantedSkills(Long userId) {
        return skillWantedRepository.findByUserId(userId).stream()
                .map(this::mapWantedToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDTO addWantedSkill(String email, SkillDTO dto) {
        User user = findUserByEmail(email);
        String normalizedName = dto.getSkillName().trim();

        if (skillWantedRepository.existsBySkillNameIgnoreCaseAndUserId(normalizedName, user.getId())) {
            throw new BadRequestException("You already want this skill: " + normalizedName);
        }

        SkillWanted skill = SkillWanted.builder()
                .skillName(normalizedName)
                .desiredLevel(dto.getProficiencyLevel() != null
                        ? dto.getProficiencyLevel() : ProficiencyLevel.BEGINNER)
                .description(dto.getDescription())
                .user(user)
                .build();

        skill = skillWantedRepository.save(skill);
        return mapWantedToDTO(skill);
    }

    @Transactional
    public SkillDTO updateWantedSkill(String email, Long skillId, SkillDTO dto) {
        User user = findUserByEmail(email);
        SkillWanted skill = skillWantedRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        if (!skill.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only edit your own skills");
        }

        if (dto.getSkillName() != null && !dto.getSkillName().isBlank()) {
            skill.setSkillName(dto.getSkillName().trim());
        }
        if (dto.getProficiencyLevel() != null) {
            skill.setDesiredLevel(dto.getProficiencyLevel());
        }
        if (dto.getDescription() != null) {
            skill.setDescription(dto.getDescription());
        }

        skill = skillWantedRepository.save(skill);
        return mapWantedToDTO(skill);
    }

    @Transactional
    public void deleteWantedSkill(String email, Long skillId) {
        User user = findUserByEmail(email);
        SkillWanted skill = skillWantedRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        if (!skill.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only delete your own skills");
        }

        skillWantedRepository.delete(skill);
    }

    // ===== Search =====

    public List<SkillDTO> searchSkills(String query) {
        List<SkillDTO> offered = skillOfferedRepository
                .findBySkillNameContainingIgnoreCase(query).stream()
                .map(this::mapOfferedToDTO)
                .toList();

        List<SkillDTO> wanted = skillWantedRepository
                .findBySkillNameContainingIgnoreCase(query).stream()
                .map(this::mapWantedToDTO)
                .toList();

        return Stream.concat(offered.stream(), wanted.stream())
                .collect(Collectors.toList());
    }

    // ===== Helpers =====

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private SkillDTO mapOfferedToDTO(SkillOffered skill) {
        return SkillDTO.builder()
                .id(skill.getId())
                .skillName(skill.getSkillName())
                .proficiencyLevel(skill.getProficiencyLevel())
                .description(skill.getDescription())
                .userId(skill.getUser().getId())
                .userName(skill.getUser().getName())
                .build();
    }

    private SkillDTO mapWantedToDTO(SkillWanted skill) {
        return SkillDTO.builder()
                .id(skill.getId())
                .skillName(skill.getSkillName())
                .proficiencyLevel(skill.getDesiredLevel())
                .description(skill.getDescription())
                .userId(skill.getUser().getId())
                .userName(skill.getUser().getName())
                .build();
    }
}
