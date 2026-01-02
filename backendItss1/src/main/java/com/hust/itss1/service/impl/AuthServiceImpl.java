package com.hust.itss1.service.impl;

import com.hust.itss1.dto.request.ChangePasswordRequest;
import com.hust.itss1.dto.request.ForgotPasswordRequest;
import com.hust.itss1.dto.request.LoginRequest;
import com.hust.itss1.dto.request.ResetPasswordRequest;
import com.hust.itss1.dto.request.SignupRequest;
import com.hust.itss1.dto.response.EmailCheckResponse;
import com.hust.itss1.dto.response.JwtResponse;
import com.hust.itss1.dto.response.MessageResponse;
import com.hust.itss1.entity.User;
import com.hust.itss1.repository.UserRepository;
import com.hust.itss1.security.JwtUtils;
import com.hust.itss1.security.UserDetailsImpl;
import com.hust.itss1.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                Collections.singletonList("ROLE_USER")
        );
    }

    @Override
    public MessageResponse registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return new MessageResponse("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(encoder.encode(signupRequest.getPassword()));

        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }

    @Override
    public EmailCheckResponse checkEmailExists(ForgotPasswordRequest request) {
        boolean exists = userRepository.existsByEmail(request.getEmail());
        if (exists) {
            // Kiểm tra nếu là tài khoản OAuth2
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);
            if (user != null && user.getProviderId() != null && !user.getProviderId().isEmpty()) {
                return new EmailCheckResponse(false, "Tài khoản này đăng nhập qua Google/Facebook, không thể đặt lại mật khẩu.");
            }
            return new EmailCheckResponse(true, "Email tồn tại trong hệ thống.");
        } else {
            return new EmailCheckResponse(false, "Email không tồn tại trong hệ thống.");
        }
    }

    @Override
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        // Kiểm tra email có tồn tại không
        if (!userRepository.existsByEmail(request.getEmail())) {
            return new MessageResponse("Error: Email không tồn tại trong hệ thống.");
        }

        // Lấy thông tin user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra nếu là tài khoản OAuth2 (Google/Facebook)
        if (user.getProviderId() != null && !user.getProviderId().isEmpty()) {
            return new MessageResponse("Error: Tài khoản đăng nhập qua Google/Facebook không thể đặt lại mật khẩu.");
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return new MessageResponse("Error: Mật khẩu mới và xác nhận mật khẩu không khớp.");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new MessageResponse("Đặt lại mật khẩu thành công!");
    }

    @Override
    public MessageResponse changePassword(Long userId, ChangePasswordRequest request) {
        // Lấy thông tin user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra nếu là tài khoản OAuth2 (Google/Facebook)
        if (user.getProviderId() != null && !user.getProviderId().isEmpty()) {
            return new MessageResponse("Error: Tài khoản đăng nhập qua Google/Facebook không thể đổi mật khẩu.");
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return new MessageResponse("Error: Mật khẩu mới và xác nhận mật khẩu không khớp.");
        }


        // Kiểm tra mật khẩu hiện tại có đúng không
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return new MessageResponse("Error: Mật khẩu hiện tại không đúng.");
        }

        // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
        if (encoder.matches(request.getNewPassword(), user.getPassword())) {
            return new MessageResponse("Error: Mật khẩu mới phải khác với mật khẩu hiện tại.");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new MessageResponse("Đổi mật khẩu thành công!");
    }
}

