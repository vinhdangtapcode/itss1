package com.hust.itss1.service.impl;

import com.hust.itss1.entity.TranslationHistory;
import com.hust.itss1.entity.User;
import com.hust.itss1.repository.TranslationHistoryRepository;
import com.hust.itss1.service.TranslationHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TranslationHistoryServiceImpl implements TranslationHistoryService {

    private final TranslationHistoryRepository translationHistoryRepository;

    @Override
    @Transactional
    public TranslationHistory saveTranslationHistory(User user, String originalText, String translatedText,
                                                     String sourceLanguage, String targetLanguage) {
        TranslationHistory history = TranslationHistory.builder()
                .user(user)
                .originalText(originalText)
                .translatedText(translatedText)
                .sourceLanguage(sourceLanguage)
                .targetLanguage(targetLanguage)
                .build();

        return translationHistoryRepository.save(history);
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
    @Transactional(readOnly = true)
    public long countUserTranslations(Long userId) {
        return translationHistoryRepository.countByUserId(userId);
    }
}

