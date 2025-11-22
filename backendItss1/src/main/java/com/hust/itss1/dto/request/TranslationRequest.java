package com.hust.itss1.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TranslationRequest {
    @NotBlank(message = "Vui lòng nhập văn bản cần dịch")
    private String text;
}

