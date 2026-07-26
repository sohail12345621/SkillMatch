package com.skillmatch.repository;

import com.skillmatch.entity.SkillWanted;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillWantedRepository extends JpaRepository<SkillWanted, Long> {

    List<SkillWanted> findByUserId(Long userId);

    List<SkillWanted> findBySkillNameContainingIgnoreCase(String skillName);

    List<SkillWanted> findBySkillNameIgnoreCaseAndUserIdNot(String skillName, Long userId);

    boolean existsBySkillNameIgnoreCaseAndUserId(String skillName, Long userId);
}
