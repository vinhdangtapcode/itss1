package com.hust.itss1.repository;

import com.hust.itss1.entity.TranslationHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TranslationHistoryRepository extends JpaRepository<TranslationHistory, Long> {
    List<TranslationHistory> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<TranslationHistory> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByUserId(Long userId);

    void deleteByUserId(Long userId);

    long countByCreatedAtBefore(LocalDateTime cutoff);

    @Query("SELECT t.id FROM TranslationHistory t WHERE t.createdAt < :cutoff")
    List<Long> findIdsByCreatedAtBefore(@Param("cutoff") LocalDateTime cutoff, Pageable pageable);

    @Modifying
    @Query("DELETE FROM TranslationHistory t WHERE t.id IN :ids")
    void deleteByIdIn(@Param("ids") List<Long> ids);
}
