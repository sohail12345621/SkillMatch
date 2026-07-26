package com.skillmatch.controller;

import com.skillmatch.dto.MatchDTO;
import com.skillmatch.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping("/suggestions")
    public ResponseEntity<List<MatchDTO>> getSuggestedMatches(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<MatchDTO> matches = matchService.generateMatches(userDetails.getUsername());
        return ResponseEntity.ok(matches);
    }

    @GetMapping
    public ResponseEntity<List<MatchDTO>> getAllMatches(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<MatchDTO> matches = matchService.getAllMatches(userDetails.getUsername());
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<MatchDTO>> getAcceptedMatches(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<MatchDTO> matches = matchService.getAcceptedMatches(userDetails.getUsername());
        return ResponseEntity.ok(matches);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<MatchDTO> acceptMatch(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        MatchDTO match = matchService.acceptMatch(userDetails.getUsername(), id);
        return ResponseEntity.ok(match);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<MatchDTO> rejectMatch(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        MatchDTO match = matchService.rejectMatch(userDetails.getUsername(), id);
        return ResponseEntity.ok(match);
    }
}
