package com.hust.itss1.service;

import com.hust.itss1.dto.request.LoginRequest;
import com.hust.itss1.dto.request.SignupRequest;
import com.hust.itss1.dto.response.JwtResponse;
import com.hust.itss1.dto.response.MessageResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);

    MessageResponse registerUser(SignupRequest signupRequest);
}

