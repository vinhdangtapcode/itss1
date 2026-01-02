package com.hust.itss1.service.impl;

import com.hust.itss1.entity.TranslationHistory;
import com.hust.itss1.entity.User;
import com.hust.itss1.repository.TranslationHistoryRepository;
import com.hust.itss1.service.TranslationHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TranslationHistoryServiceImpl implements TranslationHistoryService {

    private final TranslationHistoryRepository translationHistoryRepository;

    @Override
    @Transactional
    public void saveTranslationHistory(User user, String originalText, String translatedText,
                                       String sourceLanguage, String targetLanguage,
                                       String userContext, String contextAnalysis) {
        TranslationHistory history = TranslationHistory.builder()
                .user(user)
                .originalText(originalText)
                .translatedText(translatedText)
                .sourceLanguage(sourceLanguage)
                .targetLanguage(targetLanguage)
                .userContext(userContext)
                .contextAnalysis(contextAnalysis)
                .build();

        translationHistoryRepository.save(history);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TranslationHistory> getUserTranslationHistory(Long userId) {
        return translationHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TranslationHistory> getUserTranslationHistory(Long userId, Pageable pageable) {
        return translationHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Override
    @Transactional
    public void deleteUserTranslationHistory(Long userId) {
        translationHistoryRepository.deleteByUserId(userId);
    }

    @Override
    @Transactional
    public long deleteOldTranslationHistories(LocalDateTime cutoff, int batchSize) {
        long totalDeleted = 0;
        long totalToDelete = translationHistoryRepository.countByCreatedAtBefore(cutoff);

        if (totalToDelete == 0) {
            log.info("Không có bản ghi lịch sử dịch nào cần xóa (trước thời điểm {})", cutoff);
            return 0;
        }

        log.info("Bắt đầu xóa {} bản ghi lịch sử dịch cũ hơn {} theo batch (batch size: {})",
                totalToDelete, cutoff, batchSize);

        List<Long> idsToDelete;
        do {
            // Lấy danh sách ID cần xóa theo batch
            idsToDelete = translationHistoryRepository.findIdsByCreatedAtBefore(
                    cutoff, PageRequest.of(0, batchSize));

            if (!idsToDelete.isEmpty()) {
                translationHistoryRepository.deleteByIdIn(idsToDelete);
                totalDeleted += idsToDelete.size();
                log.debug("Đã xóa batch {} bản ghi. Tổng đã xóa: {}/{}",
                        idsToDelete.size(), totalDeleted, totalToDelete);
            }
        } while (!idsToDelete.isEmpty());

        log.info("Hoàn thành xóa lịch sử dịch: đã xóa {} bản ghi", totalDeleted);
        return totalDeleted;
    }

    @Override
    @Transactional(readOnly = true)
    public long countUserTranslations(Long userId) {
        return translationHistoryRepository.countByUserId(userId);
    }
}
