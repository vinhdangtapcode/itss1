package com.hust.itss1.service;
import com.hust.itss1.entity.TranslationHistory;
import com.hust.itss1.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TranslationHistoryService {

    TranslationHistory saveTranslationHistory(User user, String originalText, String translatedText,
                                             String sourceLanguage, String targetLanguage);

    List<TranslationHistory> getUserTranslationHistory(Long userId);

    Page<TranslationHistory> getUserTranslationHistory(Long userId, Pageable pageable);

    void deleteUserTranslationHistory(Long userId);

    long countUserTranslations(Long userId);
}

