package com.hust.itss1.controller;

import com.hust.itss1.dto.request.ForgotPasswordRequest;
import com.hust.itss1.dto.request.LoginRequest;
import com.hust.itss1.dto.request.ResetPasswordRequest;
import com.hust.itss1.dto.request.SignupRequest;
import com.hust.itss1.dto.response.EmailCheckResponse;
import com.hust.itss1.dto.response.JwtResponse;
import com.hust.itss1.dto.response.MessageResponse;
import jakarta.validation.Valid;
import com.hust.itss1.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        MessageResponse messageResponse = authService.registerUser(signupRequest);

        if (messageResponse.getMessage().startsWith("Error")) {
            return ResponseEntity.badRequest().body(messageResponse);
        }

        return ResponseEntity.ok(messageResponse);
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@Valid @RequestBody ForgotPasswordRequest request) {
        EmailCheckResponse response = authService.checkEmailExists(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        MessageResponse messageResponse = authService.resetPassword(request);
        
        if (messageResponse.getMessage().startsWith("Error")) {
            return ResponseEntity.badRequest().body(messageResponse);
        }
        
        return ResponseEntity.ok(messageResponse);
    }
}

