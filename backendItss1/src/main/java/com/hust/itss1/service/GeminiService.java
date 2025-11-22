package com.hust.itss1.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import org.springframework.http.MediaType;

import java.util.Map;
import java.util.List;

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

    public String translateJapaneseToVietnamese(String originalText) {
        String prompt = "Bạn là một biên dịch viên chuyên nghiệp. Hãy dịch đoạn văn bản tiếng Nhật sau sang tiếng Việt một cách tự nhiên, chính xác: \n\n"
                + originalText;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)))));

        // 3. Gọi API
        try {
            String fullUrl = apiUrl + "?key=" + apiKey;

            Map response = restClient.post()
                    .uri(fullUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            return extractTextFromResponse(response);

        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi dịch thuật: " + e.getMessage();
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
}