package com.skillmatch.repository;

import com.skillmatch.entity.Match;
import com.skillmatch.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE (m.requester.id = :userId OR m.responder.id = :userId)")
    List<Match> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT m FROM Match m WHERE (m.requester.id = :userId OR m.responder.id = :userId) AND m.status = :status")
    List<Match> findAllByUserIdAndStatus(@Param("userId") Long userId, @Param("status") MatchStatus status);

    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END FROM Match m " +
           "WHERE ((m.requester.id = :user1Id AND m.responder.id = :user2Id) " +
           "OR (m.requester.id = :user2Id AND m.responder.id = :user1Id)) " +
           "AND m.requesterSkill = :skill1 AND m.responderSkill = :skill2 " +
           "AND m.status <> 'REJECTED'")
    boolean existsMatchBetweenUsers(@Param("user1Id") Long user1Id,
                                     @Param("user2Id") Long user2Id,
                                     @Param("skill1") String skill1,
                                     @Param("skill2") String skill2);
}
