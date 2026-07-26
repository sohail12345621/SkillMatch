package com.skillmatch.controller;

import com.skillmatch.dto.*;
import com.skillmatch.enums.SessionStatus;
import com.skillmatch.service.MatchService;
import com.skillmatch.service.SessionService;
import com.skillmatch.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserService userService;
    private final MatchService matchService;
    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();

        UserDTO user = userService.getCurrentUser(email);
        List<MatchDTO> suggested = matchService.generateMatches(email);
        List<MatchDTO> allMatches = matchService.getAllMatches(email);
        List<SessionDTO> upcoming = sessionService.getUserSessionsByStatus(email, SessionStatus.ACCEPTED);
        List<SessionDTO> completed = sessionService.getUserSessionsByStatus(email, SessionStatus.COMPLETED);
        List<SessionDTO> allSessions = sessionService.getUserSessions(email);

        DashboardDTO dashboard = DashboardDTO.builder()
                .user(user)
                .suggestedMatches(suggested)
                .upcomingSessions(upcoming)
                .completedSessions(completed)
                .totalMatches(allMatches.size())
                .totalSessions(allSessions.size())
                .build();

        return ResponseEntity.ok(dashboard);
    }
}
