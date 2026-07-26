package com.skillmatch.repository;

import com.skillmatch.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String name);

    List<User> findByCollegeContainingIgnoreCase(String college);

    List<User> findByNameContainingIgnoreCaseOrCollegeContainingIgnoreCase(String name, String college);
}
