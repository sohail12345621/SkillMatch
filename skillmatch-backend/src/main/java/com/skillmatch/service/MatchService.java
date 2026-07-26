package com.skillmatch.service;

import com.skillmatch.dto.MatchDTO;
import com.skillmatch.entity.*;
import com.skillmatch.enums.MatchStatus;
import com.skillmatch.exception.BadRequestException;
import com.skillmatch.exception.ResourceNotFoundException;
import com.skillmatch.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final SkillOfferedRepository skillOfferedRepository;
    private final SkillWantedRepository skillWantedRepository;

    /**
     * Core matching algorithm:
     * For current user U, find all users V where:
     *   - V offers a skill that U wants  AND
     *   - V wants a skill that U offers  AND
     *   - No existing non-rejected match exists for that pair
     * Creates Match entries with status SUGGESTED.
     */
    @Transactional
    public List<MatchDTO> generateMatches(String email) {
        User currentUser = findUserByEmail(email);
        List<SkillOffered> myOffered = skillOfferedRepository.findByUserId(currentUser.getId());
        List<SkillWanted> myWanted = skillWantedRepository.findByUserId(currentUser.getId());

        if (myOffered.isEmpty() || myWanted.isEmpty()) {
            return getSuggestedMatches(email);
        }

        List<Match> newMatches = new ArrayList<>();

        for (SkillWanted wanted : myWanted) {
            // Find users who OFFER what I WANT
            List<SkillOffered> candidatesOffering = skillOfferedRepository
                    .findBySkillNameIgnoreCaseAndUserIdNot(wanted.getSkillName(), currentUser.getId());

            for (SkillOffered candidateSkill : candidatesOffering) {
                User candidate = candidateSkill.getUser();

                // Check if this candidate WANTS something I OFFER
                List<SkillWanted> candidateWants = skillWantedRepository.findByUserId(candidate.getId());

                for (SkillWanted candidateWant : candidateWants) {
                    // Does my offered list contain what the candidate wants?
                    boolean iOffer = myOffered.stream()
                            .anyMatch(o -> o.getSkillName().equalsIgnoreCase(candidateWant.getSkillName()));

                    if (iOffer) {
                        // Find the specific skill I offer that matches
                        String myOfferedSkill = myOffered.stream()
                                .filter(o -> o.getSkillName().equalsIgnoreCase(candidateWant.getSkillName()))
                                .findFirst()
                                .map(SkillOffered::getSkillName)
                                .orElse(candidateWant.getSkillName());

                        // Check for duplicate match (either direction)
                        boolean alreadyExists = matchRepository.existsMatchBetweenUsers(
                                currentUser.getId(), candidate.getId(),
                                myOfferedSkill, candidateSkill.getSkillName());

                        // Also check reverse skill order
                        boolean reverseExists = matchRepository.existsMatchBetweenUsers(
                                currentUser.getId(), candidate.getId(),
                                candidateSkill.getSkillName(), myOfferedSkill);

                        if (!alreadyExists && !reverseExists) {
                            Match match = Match.builder()
                                    .requester(currentUser)
                                    .responder(candidate)
                                    .requesterSkill(myOfferedSkill)
                                    .responderSkill(candidateSkill.getSkillName())
                                    .status(MatchStatus.SUGGESTED)
                                    .build();
                            newMatches.add(match);
                        }
                    }
                }
            }
        }

        if (!newMatches.isEmpty()) {
            matchRepository.saveAll(newMatches);
        }

        return getSuggestedMatches(email);
    }

    public List<MatchDTO> getSuggestedMatches(String email) {
        User user = findUserByEmail(email);
        return matchRepository.findAllByUserIdAndStatus(user.getId(), MatchStatus.SUGGESTED)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MatchDTO> getAcceptedMatches(String email) {
        User user = findUserByEmail(email);
        return matchRepository.findAllByUserIdAndStatus(user.getId(), MatchStatus.ACCEPTED)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MatchDTO> getAllMatches(String email) {
        User user = findUserByEmail(email);
        return matchRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MatchDTO acceptMatch(String email, Long matchId) {
        User user = findUserByEmail(email);
        Match match = findMatchOrThrow(matchId);
        validateUserInMatch(user, match);

        if (match.getStatus() != MatchStatus.SUGGESTED) {
            throw new BadRequestException("Can only accept suggested matches");
        }

        match.setStatus(MatchStatus.ACCEPTED);
        match = matchRepository.save(match);
        return mapToDTO(match);
    }

    @Transactional
    public MatchDTO rejectMatch(String email, Long matchId) {
        User user = findUserByEmail(email);
        Match match = findMatchOrThrow(matchId);
        validateUserInMatch(user, match);

        if (match.getStatus() != MatchStatus.SUGGESTED) {
            throw new BadRequestException("Can only reject suggested matches");
        }

        match.setStatus(MatchStatus.REJECTED);
        match = matchRepository.save(match);
        return mapToDTO(match);
    }

    // ===== Helpers =====

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Match findMatchOrThrow(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match", "id", id));
    }

    private void validateUserInMatch(User user, Match match) {
        if (!match.getRequester().getId().equals(user.getId())
                && !match.getResponder().getId().equals(user.getId())) {
            throw new BadRequestException("You are not part of this match");
        }
    }

    public MatchDTO mapToDTO(Match match) {
        User req = match.getRequester();
        User res = match.getResponder();

        return MatchDTO.builder()
                .id(match.getId())
                .requesterId(req.getId())
                .requesterName(req.getName())
                .requesterEmail(req.getEmail())
                .requesterProfilePicture(req.getProfilePicture())
                .requesterCollege(req.getCollege())
                .requesterRating(req.getAverageRating())
                .responderId(res.getId())
                .responderName(res.getName())
                .responderEmail(res.getEmail())
                .responderProfilePicture(res.getProfilePicture())
                .responderCollege(res.getCollege())
                .responderRating(res.getAverageRating())
                .requesterSkill(match.getRequesterSkill())
                .responderSkill(match.getResponderSkill())
                .status(match.getStatus())
                .createdAt(match.getCreatedAt())
                .build();
    }
}
