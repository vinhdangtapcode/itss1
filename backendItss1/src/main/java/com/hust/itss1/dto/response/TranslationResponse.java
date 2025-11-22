package com.hust.itss1.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TranslationResponse {
    private String original;
    private String translated;
    private String username;
    private String message;
    private boolean success;
}

