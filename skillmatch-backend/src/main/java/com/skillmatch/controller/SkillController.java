package com.skillmatch.controller;

import com.skillmatch.dto.SkillDTO;
import com.skillmatch.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    // ===== Skills Offered =====

    @PostMapping("/offered")
    public ResponseEntity<SkillDTO> addOfferedSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SkillDTO dto) {
        SkillDTO skill = skillService.addOfferedSkill(userDetails.getUsername(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(skill);
    }

    @PutMapping("/offered/{id}")
    public ResponseEntity<SkillDTO> updateOfferedSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody SkillDTO dto) {
        SkillDTO skill = skillService.updateOfferedSkill(userDetails.getUsername(), id, dto);
        return ResponseEntity.ok(skill);
    }

    @DeleteMapping("/offered/{id}")
    public ResponseEntity<Map<String, String>> deleteOfferedSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        skillService.deleteOfferedSkill(userDetails.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Skill deleted successfully"));
    }

    // ===== Skills Wanted =====

    @PostMapping("/wanted")
    public ResponseEntity<SkillDTO> addWantedSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SkillDTO dto) {
        SkillDTO skill = skillService.addWantedSkill(userDetails.getUsername(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(skill);
    }

    @PutMapping("/wanted/{id}")
    public ResponseEntity<SkillDTO> updateWantedSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody SkillDTO dto) {
        SkillDTO skill = skillService.updateWantedSkill(userDetails.getUsername(), id, dto);
        return ResponseEntity.ok(skill);
    }

    @DeleteMapping("/wanted/{id}")
    public ResponseEntity<Map<String, String>> deleteWantedSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        skillService.deleteWantedSkill(userDetails.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Skill deleted successfully"));
    }

    // ===== Search =====

    @GetMapping("/search")
    public ResponseEntity<List<SkillDTO>> searchSkills(@RequestParam String query) {
        List<SkillDTO> skills = skillService.searchSkills(query);
        return ResponseEntity.ok(skills);
    }
}
