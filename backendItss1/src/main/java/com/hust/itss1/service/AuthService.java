package com.hust.itss1.service;

import com.hust.itss1.dto.request.ChangePasswordRequest;
import com.hust.itss1.dto.request.ForgotPasswordRequest;
import com.hust.itss1.dto.request.LoginRequest;
import com.hust.itss1.dto.request.ResetPasswordRequest;
import com.hust.itss1.dto.request.SignupRequest;
import com.hust.itss1.dto.response.EmailCheckResponse;
import com.hust.itss1.dto.response.JwtResponse;
import com.hust.itss1.dto.response.MessageResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);

    MessageResponse registerUser(SignupRequest signupRequest);

    EmailCheckResponse checkEmailExists(ForgotPasswordRequest request);

    MessageResponse resetPassword(ResetPasswordRequest request);

    MessageResponse changePassword(Long userId, ChangePasswordRequest request);
}

