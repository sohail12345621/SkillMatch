package com.skillmatch.repository;

import com.skillmatch.entity.Session;
import com.skillmatch.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findByMatchId(Long matchId);

    @Query("SELECT s FROM Session s WHERE " +
           "(s.match.requester.id = :userId OR s.match.responder.id = :userId)")
    List<Session> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM Session s WHERE " +
           "(s.match.requester.id = :userId OR s.match.responder.id = :userId) " +
           "AND s.status = :status")
    List<Session> findAllByUserIdAndStatus(@Param("userId") Long userId,
                                           @Param("status") SessionStatus status);
}
