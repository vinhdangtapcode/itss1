package com.hust.itss1.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.hust.itss1.dto.request.TranslationRequest;
import com.hust.itss1.dto.response.TranslationResponse;
import com.hust.itss1.entity.TranslationHistory;
import com.hust.itss1.entity.User;
import com.hust.itss1.repository.UserRepository;
import com.hust.itss1.service.GeminiService;
import com.hust.itss1.service.TranslationHistoryService;
import com.hust.itss1.security.UserDetailsImpl;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/translate")
@CrossOrigin(origins = "*")
public class TranslationController {

    private final GeminiService geminiService;
    private final TranslationHistoryService translationHistoryService;
    private final UserRepository userRepository;

    public TranslationController(GeminiService geminiService,
                                TranslationHistoryService translationHistoryService,
                                UserRepository userRepository) {
        this.geminiService = geminiService;
        this.translationHistoryService = translationHistoryService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<TranslationResponse> translate(
            @Valid @RequestBody TranslationRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body(
                TranslationResponse.builder()
                    .success(false)
                    .message("Vui lòng đăng nhập để sử dụng dịch vụ dịch thuật")
                    .build()
            );
        }

        String translatedText = geminiService.translateJapaneseToVietnamese(request.getText());

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        translationHistoryService.saveTranslationHistory(
            user,
            request.getText(),
            translatedText,
            "ja", // Japanese
            "vi"  // Vietnamese
        );

        return ResponseEntity.ok(
            TranslationResponse.builder()
                .success(true)
                .original(request.getText())
                .translated(translatedText)
                .username(userDetails.getUsername())
                .message("Dịch thành công")
                .build()
        );
    }

    @GetMapping("/history")
    public ResponseEntity<Page<TranslationHistory>> getTranslationHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<TranslationHistory> history = translationHistoryService.getUserTranslationHistory(
            userDetails.getId(),
            pageable
        );

        return ResponseEntity.ok(history);
    }

    @GetMapping("/history/all")
    public ResponseEntity<List<TranslationHistory>> getAllTranslationHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        List<TranslationHistory> history = translationHistoryService.getUserTranslationHistory(
            userDetails.getId()
        );

        return ResponseEntity.ok(history);
    }

    @GetMapping("/history/count")
    public ResponseEntity<Long> countTranslations(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        long count = translationHistoryService.countUserTranslations(userDetails.getId());
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/history")
    public ResponseEntity<String> deleteTranslationHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        translationHistoryService.deleteUserTranslationHistory(userDetails.getId());
        return ResponseEntity.ok("Đã xóa lịch sử dịch thành công");
    }
}
