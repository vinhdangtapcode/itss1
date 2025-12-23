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

    // Đơn vị: giây (30 giây mặc định để demo, production nên đặt 2592000 = 30 ngày)
    @Value("${app.translation-history.retention-seconds:300}")
    private int retentionSeconds;

    @Value("${app.translation-history.cleanup-batch-size:1000}")
    private int batchSize;

    // Chạy mỗi 10 giây để demo (production nên đổi lại thành "0 0 2 * * *" = 2h
    // sáng mỗi ngày)
    // Config trong application.properties: app.translation-history.cleanup-cron
    @Scheduled(cron = "${app.translation-history.cleanup-cron:*/10 * * * * *}")
    public void cleanOldTranslationHistories() {
        log.info("Bắt đầu scheduled job xóa lịch sử dịch cũ hơn {} giây", retentionSeconds);

        LocalDateTime cutoff = LocalDateTime.now().minusSeconds(retentionSeconds);
        long deletedCount = translationHistoryService.deleteOldTranslationHistories(cutoff, batchSize);

        log.info("Scheduled job hoàn thành: đã xóa {} bản ghi lịch sử dịch", deletedCount);
    }
}
