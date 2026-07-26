package com.skillmatch.repository;

import com.skillmatch.entity.SkillOffered;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillOfferedRepository extends JpaRepository<SkillOffered, Long> {

    List<SkillOffered> findByUserId(Long userId);

    List<SkillOffered> findBySkillNameContainingIgnoreCase(String skillName);

    List<SkillOffered> findBySkillNameIgnoreCaseAndUserIdNot(String skillName, Long userId);

    boolean existsBySkillNameIgnoreCaseAndUserId(String skillName, Long userId);
}
