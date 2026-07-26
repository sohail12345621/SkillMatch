package com.skillmatch.repository;

import com.skillmatch.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByRateeId(Long rateeId);

    List<Rating> findByRaterId(Long raterId);

    boolean existsBySessionIdAndRaterId(Long sessionId, Long raterId);

    @Query("SELECT COALESCE(AVG(r.score), 0) FROM Rating r WHERE r.ratee.id = :userId")
    Double findAverageRatingByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.ratee.id = :userId")
    Integer countByRateeId(@Param("userId") Long userId);
}
