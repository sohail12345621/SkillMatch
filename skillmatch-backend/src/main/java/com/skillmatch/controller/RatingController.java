package com.skillmatch.controller;

import com.skillmatch.dto.CreateRatingRequest;
import com.skillmatch.dto.RatingDTO;
import com.skillmatch.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingDTO> submitRating(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateRatingRequest request) {
        RatingDTO rating = ratingService.submitRating(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(rating);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingDTO>> getUserRatings(@PathVariable Long userId) {
        List<RatingDTO> ratings = ratingService.getUserRatings(userId);
        return ResponseEntity.ok(ratings);
    }
}
