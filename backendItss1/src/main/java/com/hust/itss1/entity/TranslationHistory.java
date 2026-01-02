package com.hust.itss1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "translation_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String originalText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String translatedText;

    @Column(name = "source_language", length = 10)
    private String sourceLanguage; // e.g., "ja" for Japanese

    @Column(name = "target_language", length = 10)
    private String targetLanguage; // e.g., "vi" for Vietnamese

    @Column(name = "user_context", columnDefinition = "TEXT")
    private String userContext; // Context provided by user

    @Column(name = "context_analysis", columnDefinition = "TEXT")
    private String contextAnalysis; // AI analysis of context

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

