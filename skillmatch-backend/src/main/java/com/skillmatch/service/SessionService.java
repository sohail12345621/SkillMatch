package com.skillmatch.service;

import com.skillmatch.dto.CreateSessionRequest;
import com.skillmatch.dto.SessionDTO;
import com.skillmatch.entity.Match;
import com.skillmatch.entity.Session;
import com.skillmatch.entity.User;
import com.skillmatch.enums.MatchStatus;
import com.skillmatch.enums.SessionStatus;
import com.skillmatch.exception.BadRequestException;
import com.skillmatch.exception.ResourceNotFoundException;
import com.skillmatch.repository.MatchRepository;
import com.skillmatch.repository.RatingRepository;
import com.skillmatch.repository.SessionRepository;
import com.skillmatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;

    @Transactional
    public SessionDTO createSession(String email, CreateSessionRequest request) {
        User user = findUserByEmail(email);
        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Match", "id", request.getMatchId()));

        // Only participants can create sessions
        validateUserInMatch(user, match);

        // Only accepted matches can have sessions
        if (match.getStatus() != MatchStatus.ACCEPTED) {
            throw new BadRequestException("Can only schedule sessions for accepted matches");
        }

        Session session = Session.builder()
                .match(match)
                .scheduledDate(request.getScheduledDate())
                .scheduledTime(request.getScheduledTime())
                .mode(request.getMode())
                .meetingLink(request.getMeetingLink())
                .location(request.getLocation())
                .status(SessionStatus.PENDING)
                .build();

        session = sessionRepository.save(session);
        return mapToDTO(session);
    }

    public List<SessionDTO> getUserSessions(String email) {
        User user = findUserByEmail(email);
        return sessionRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionDTO> getUserSessionsByStatus(String email, SessionStatus status) {
        User user = findUserByEmail(email);
        return sessionRepository.findAllByUserIdAndStatus(user.getId(), status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SessionDTO updateSession(String email, Long sessionId, CreateSessionRequest request) {
        User user = findUserByEmail(email);
        Session session = findSessionOrThrow(sessionId);
        validateUserInMatch(user, session.getMatch());

        if (session.getStatus() == SessionStatus.COMPLETED || session.getStatus() == SessionStatus.CANCELLED) {
            throw new BadRequestException("Cannot update a " + session.getStatus().name().toLowerCase() + " session");
        }

        if (request.getScheduledDate() != null) {
            session.setScheduledDate(request.getScheduledDate());
        }
        if (request.getScheduledTime() != null) {
            session.setScheduledTime(request.getScheduledTime());
        }
        if (request.getMode() != null) {
            session.setMode(request.getMode());
        }
        if (request.getMeetingLink() != null) {
            session.setMeetingLink(request.getMeetingLink());
        }
        if (request.getLocation() != null) {
            session.setLocation(request.getLocation());
        }

        session = sessionRepository.save(session);
        return mapToDTO(session);
    }

    @Transactional
    public SessionDTO updateSessionStatus(String email, Long sessionId, SessionStatus newStatus) {
        User user = findUserByEmail(email);
        Session session = findSessionOrThrow(sessionId);
        validateUserInMatch(user, session.getMatch());

        // Validate status transitions
        SessionStatus current = session.getStatus();
        boolean validTransition = switch (newStatus) {
            case ACCEPTED -> current == SessionStatus.PENDING;
            case COMPLETED -> current == SessionStatus.ACCEPTED;
            case CANCELLED -> current == SessionStatus.PENDING || current == SessionStatus.ACCEPTED;
            default -> false;
        };

        if (!validTransition) {
            throw new BadRequestException(
                    String.format("Cannot transition from %s to %s", current, newStatus));
        }

        session.setStatus(newStatus);
        session = sessionRepository.save(session);
        return mapToDTO(session);
    }

    // ===== Helpers =====

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Session findSessionOrThrow(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session", "id", id));
    }

    private void validateUserInMatch(User user, Match match) {
        if (!match.getRequester().getId().equals(user.getId())
                && !match.getResponder().getId().equals(user.getId())) {
            throw new BadRequestException("You are not part of this match");
        }
    }

    private SessionDTO mapToDTO(Session session) {
        Match match = session.getMatch();
        User requester = match.getRequester();
        User responder = match.getResponder();

        boolean ratedByRequester = ratingRepository.existsBySessionIdAndRaterId(
                session.getId(), requester.getId());
        boolean ratedByResponder = ratingRepository.existsBySessionIdAndRaterId(
                session.getId(), responder.getId());

        return SessionDTO.builder()
                .id(session.getId())
                .matchId(match.getId())
                .requesterId(requester.getId())
                .requesterName(requester.getName())
                .responderId(responder.getId())
                .responderName(responder.getName())
                .requesterSkill(match.getRequesterSkill())
                .responderSkill(match.getResponderSkill())
                .scheduledDate(session.getScheduledDate())
                .scheduledTime(session.getScheduledTime())
                .mode(session.getMode())
                .meetingLink(session.getMeetingLink())
                .location(session.getLocation())
                .status(session.getStatus())
                .createdAt(session.getCreatedAt())
                .ratedByRequester(ratedByRequester)
                .ratedByResponder(ratedByResponder)
                .build();
    }
}
