package com.hust.itss1.config;

import com.hust.itss1.service.TranslationHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;

@Slf4j
@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class TranslationHistoryCleanupScheduler {
    private final TranslationHistoryService translationHistoryService;

    @Value("${app.translation-history.retention-days:30}")
    private int retentionDays;

    @Value("${app.translation-history.cleanup-batch-size:1000}")
    private int batchSize;

    @Scheduled(cron = "0 0 2 * * *")
    public void cleanOldTranslationHistories() {
        log.info("Bắt đầu scheduled job xóa lịch sử dịch cũ hơn {} ngày", retentionDays);

        LocalDateTime cutoff = LocalDateTime.now().minusDays(retentionDays);
        long deletedCount = translationHistoryService.deleteOldTranslationHistories(cutoff, batchSize);

        log.info("Scheduled job hoàn thành: đã xóa {} bản ghi lịch sử dịch", deletedCount);
    }
}
