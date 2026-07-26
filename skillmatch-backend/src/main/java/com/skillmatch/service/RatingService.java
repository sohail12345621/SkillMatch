package com.skillmatch.service;

import com.skillmatch.dto.CreateRatingRequest;
import com.skillmatch.dto.RatingDTO;
import com.skillmatch.entity.Rating;
import com.skillmatch.entity.Session;
import com.skillmatch.entity.User;
import com.skillmatch.enums.SessionStatus;
import com.skillmatch.exception.BadRequestException;
import com.skillmatch.exception.ResourceNotFoundException;
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
public class RatingService {

    private final RatingRepository ratingRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingDTO submitRating(String email, CreateRatingRequest request) {
        User rater = findUserByEmail(email);
        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session", "id", request.getSessionId()));

        // Session must be completed
        if (session.getStatus() != SessionStatus.COMPLETED) {
            throw new BadRequestException("Can only rate completed sessions");
        }

        // Rater must be part of the match
        Long requesterId = session.getMatch().getRequester().getId();
        Long responderId = session.getMatch().getResponder().getId();

        if (!rater.getId().equals(requesterId) && !rater.getId().equals(responderId)) {
            throw new BadRequestException("You are not part of this session");
        }

        // Check for duplicate rating
        if (ratingRepository.existsBySessionIdAndRaterId(session.getId(), rater.getId())) {
            throw new BadRequestException("You have already rated this session");
        }

        // Determine ratee (the other user)
        User ratee;
        if (rater.getId().equals(requesterId)) {
            ratee = session.getMatch().getResponder();
        } else {
            ratee = session.getMatch().getRequester();
        }

        Rating rating = Rating.builder()
                .session(session)
                .rater(rater)
                .ratee(ratee)
                .score(request.getScore())
                .feedback(request.getFeedback())
                .build();

        rating = ratingRepository.save(rating);

        // Update ratee's average rating
        updateUserAverageRating(ratee);

        return mapToDTO(rating);
    }

    public List<RatingDTO> getUserRatings(Long userId) {
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        return ratingRepository.findByRateeId(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ===== Helpers =====

    private void updateUserAverageRating(User user) {
        Double avgRating = ratingRepository.findAverageRatingByUserId(user.getId());
        Integer totalRatings = ratingRepository.countByRateeId(user.getId());

        user.setAverageRating(avgRating != null ? Math.round(avgRating * 100.0) / 100.0 : 0.0);
        user.setTotalRatings(totalRatings != null ? totalRatings : 0);
        userRepository.save(user);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private RatingDTO mapToDTO(Rating rating) {
        return RatingDTO.builder()
                .id(rating.getId())
                .sessionId(rating.getSession().getId())
                .raterId(rating.getRater().getId())
                .raterName(rating.getRater().getName())
                .rateeId(rating.getRatee().getId())
                .rateeName(rating.getRatee().getName())
                .score(rating.getScore())
                .feedback(rating.getFeedback())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
