package com.skillmatch.controller;

import com.skillmatch.dto.CreateSessionRequest;
import com.skillmatch.dto.SessionDTO;
import com.skillmatch.enums.SessionStatus;
import com.skillmatch.service.SessionService;
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
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    public ResponseEntity<SessionDTO> createSession(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateSessionRequest request) {
        SessionDTO session = sessionService.createSession(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @GetMapping
    public ResponseEntity<List<SessionDTO>> getUserSessions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) SessionStatus status) {
        List<SessionDTO> sessions;
        if (status != null) {
            sessions = sessionService.getUserSessionsByStatus(userDetails.getUsername(), status);
        } else {
            sessions = sessionService.getUserSessions(userDetails.getUsername());
        }
        return ResponseEntity.ok(sessions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionDTO> updateSession(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody CreateSessionRequest request) {
        SessionDTO session = sessionService.updateSession(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SessionDTO> updateSessionStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        SessionStatus newStatus = SessionStatus.valueOf(body.get("status").toUpperCase());
        SessionDTO session = sessionService.updateSessionStatus(userDetails.getUsername(), id, newStatus);
        return ResponseEntity.ok(session);
    }
}
