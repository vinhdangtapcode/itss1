package com.hust.itss1.service;

import com.hust.itss1.entity.TranslationHistory;
import com.hust.itss1.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface TranslationHistoryService {

    void saveTranslationHistory(User user, String originalText, String translatedText,
                                String sourceLanguage, String targetLanguage,
                                String userContext, String contextAnalysis);

    List<TranslationHistory> getUserTranslationHistory(Long userId);

    Page<TranslationHistory> getUserTranslationHistory(Long userId, Pageable pageable);

    void deleteUserTranslationHistory(Long userId);

    long countUserTranslations(Long userId);

    /**
     * @param cutoff    thời điểm cắt (bản ghi trước thời điểm này sẽ bị xóa)
     * @param batchSize số lượng bản ghi xóa mỗi batch
     * @return số lượng bản ghi đã xóa
     */
    long deleteOldTranslationHistories(LocalDateTime cutoff, int batchSize);
}
