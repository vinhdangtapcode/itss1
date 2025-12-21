package com.hust.itss1.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import org.springframework.http.MediaType;

import java.util.Map;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestClient restClient;

    public GeminiService(RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    public TranslationResult translateJapaneseToVietnamese(String originalText, String context) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Bạn là một biên dịch viên chuyên nghiệp. ");
        promptBuilder.append("Hãy dịch đoạn văn bản tiếng Nhật sang tiếng Việt một cách tự nhiên, chính xác. ");
        promptBuilder.append("Đồng thời, hãy phân tích ngắn gọn ngữ cảnh (nếu có) để người dùng hiểu thêm.\n\n");
        promptBuilder.append("Văn bản gốc:\n").append(originalText).append("\n\n");

        if (context != null && !context.isBlank()) {
            promptBuilder.append("Ngữ cảnh người dùng cung cấp (nếu hữu ích hãy sử dụng):\n")
                    .append(context)
                    .append("\n\n");
        } else {
            promptBuilder.append("Không có ngữ cảnh bổ sung từ người dùng.\n\n");
        }

        promptBuilder.append("Chỉ trả lời JSON thuần, không Markdown, không lời nói thêm. ")
                .append("Đúng mẫu: {\"translation\": \"...\", \"context_analysis\": \"...\"}. ");

        String prompt = promptBuilder.toString();

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)))));

        try {
            String fullUrl = apiUrl + "?key=" + apiKey;

            Map response = restClient.post()
                    .uri(fullUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            String modelText = extractTextFromResponse(response);
            return parseTranslationResult(modelText);

        } catch (Exception e) {
            e.printStackTrace();
            return new TranslationResult(
                    "Lỗi dịch thuật: " + e.getMessage(),
                    "Không thể phân tích ngữ cảnh do lỗi gọi API.");
        }
    }

    private String extractTextFromResponse(Map response) {
        try {
            List candidates = (List) response.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);
            return (String) firstPart.get("text");
        } catch (Exception e) {
            return "Không thể phân tích phản hồi từ Gemini.";
        }
    }

    private TranslationResult parseTranslationResult(String modelText) {
        if (modelText == null) {
            return new TranslationResult(
                    "Không nhận được phản hồi từ mô hình.",
                    "Không thể phân tích ngữ cảnh.");
        }

        // Strip markdown code blocks if present (e.g., ```json ... ```)
        String cleanedText = modelText.trim();
        if (cleanedText.startsWith("```")) {
            // Remove opening ```json or ```
            int firstNewline = cleanedText.indexOf('\n');
            if (firstNewline != -1) {
                cleanedText = cleanedText.substring(firstNewline + 1);
            }
            // Remove closing ```
            if (cleanedText.endsWith("```")) {
                cleanedText = cleanedText.substring(0, cleanedText.length() - 3).trim();
            }
        }

        // 1) Thử parse JSON chuẩn
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map data = mapper.readValue(cleanedText, Map.class);
            String translation = (String) data.getOrDefault("translation", cleanedText);
            String contextAnalysis = (String) data.getOrDefault("context_analysis", "");
            return new TranslationResult(translation, contextAnalysis);
        } catch (Exception ignore) {
            // tiếp tục fallback
        }

        // 2) Fallback: cố tách theo các nhãn thường gặp
        String lower = cleanedText.toLowerCase();
        int ctxIdx = lower.indexOf("context_analysis");
        if (ctxIdx == -1) {
            ctxIdx = lower.indexOf("analysis");
        }
        if (ctxIdx != -1) {
            String translation = cleanedText.substring(0, ctxIdx).trim();
            String contextAnalysis = cleanedText.substring(ctxIdx).replaceFirst("(?i)context_analysis\\s*[:=]", "")
                    .replaceFirst("(?i)analysis\\s*[:=]", "")
                    .trim();
            return new TranslationResult(translation, contextAnalysis);
        }

        // 3) Nếu không tách được, giữ nguyên bản dịch, để phân tích trống
        return new TranslationResult(cleanedText, "");
    }

    public static class TranslationResult {
        private final String translation;
        private final String contextAnalysis;

        public TranslationResult(String translation, String contextAnalysis) {
            this.translation = translation;
            this.contextAnalysis = contextAnalysis;
        }

        public String getTranslation() {
            return translation;
        }

        public String getContextAnalysis() {
            return contextAnalysis;
        }
    }
}
