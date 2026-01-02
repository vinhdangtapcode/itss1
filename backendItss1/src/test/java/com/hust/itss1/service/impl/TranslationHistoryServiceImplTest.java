package com.hust.itss1.service.impl;

import com.hust.itss1.entity.User;
import com.hust.itss1.repository.TranslationHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TranslationHistoryServiceImplTest {
    @Mock
    private TranslationHistoryRepository translationHistoryRepository;

    @InjectMocks
    private TranslationHistoryServiceImpl translationHistoryService;

	private static final int BATCH_SIZE = 1000;

    @BeforeEach
    void setUp() {
	    User user = new User();
        user.setId(1L);
    }

    @Test
    void testDeleteOldTranslationHistories_NoRecordsToDelete() {
        LocalDateTime cutoff = LocalDateTime.of(2025, 11, 22, 0, 0);

        // Giả lập không có bản ghi cần xóa
        when(translationHistoryRepository.countByCreatedAtBefore(cutoff)).thenReturn(0L);

        long result = translationHistoryService.deleteOldTranslationHistories(cutoff, BATCH_SIZE);

        assertEquals(0, result);
        verify(translationHistoryRepository, times(1)).countByCreatedAtBefore(cutoff);
        verify(translationHistoryRepository, never()).findIdsByCreatedAtBefore(any(), any());
        verify(translationHistoryRepository, never()).deleteByIdIn(any());
    }

    @Test
    void testDeleteOldTranslationHistories_WithRecordsToDelete() {
        LocalDateTime cutoff = LocalDateTime.of(2025, 11, 22, 0, 0);
        List<Long> idsToDelete = Arrays.asList(1L, 2L, 3L);

        // Giả lập có 3 bản ghi cần xóa
        when(translationHistoryRepository.countByCreatedAtBefore(cutoff)).thenReturn(3L);
        // Lần đầu trả về 3 ID, lần sau trả về empty list
        when(translationHistoryRepository.findIdsByCreatedAtBefore(eq(cutoff), any(PageRequest.class)))
                .thenReturn(idsToDelete)
                .thenReturn(Collections.emptyList());
        doNothing().when(translationHistoryRepository).deleteByIdIn(idsToDelete);

        long result = translationHistoryService.deleteOldTranslationHistories(cutoff, BATCH_SIZE);

        assertEquals(3, result);
        verify(translationHistoryRepository, times(1)).countByCreatedAtBefore(cutoff);
        verify(translationHistoryRepository, times(2)).findIdsByCreatedAtBefore(eq(cutoff), any(PageRequest.class));
        verify(translationHistoryRepository, times(1)).deleteByIdIn(idsToDelete);
    }

    @Test
    void testDeleteOldTranslationHistories_MultipleBatches() {
        LocalDateTime cutoff = LocalDateTime.of(2025, 11, 22, 0, 0);
        List<Long> batch1 = Arrays.asList(1L, 2L);
        List<Long> batch2 = Arrays.asList(3L, 4L);

        // Giả lập có 4 bản ghi cần xóa trong 2 batch
        when(translationHistoryRepository.countByCreatedAtBefore(cutoff)).thenReturn(4L);
        when(translationHistoryRepository.findIdsByCreatedAtBefore(eq(cutoff), any(PageRequest.class)))
                .thenReturn(batch1)
                .thenReturn(batch2)
                .thenReturn(Collections.emptyList());
        doNothing().when(translationHistoryRepository).deleteByIdIn(anyList());

        long result = translationHistoryService.deleteOldTranslationHistories(cutoff, 2);

        assertEquals(4, result);
        verify(translationHistoryRepository, times(3)).findIdsByCreatedAtBefore(eq(cutoff), any(PageRequest.class));
        verify(translationHistoryRepository, times(2)).deleteByIdIn(anyList());
    }
}
