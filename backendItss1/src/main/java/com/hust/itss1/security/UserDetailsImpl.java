package com.hust.itss1.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hust.itss1.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.io.Serial;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails, OAuth2User {
    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String email;

    @JsonIgnore
    private String password;

    private Map<String, Object> attributes;

    public UserDetailsImpl(Long id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    public static UserDetailsImpl build(User user) {
        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword()
        );
    }

    public static UserDetailsImpl build(User user, Map<String, Object> attributes) {
        UserDetailsImpl userDetails = new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword()
        );
        userDetails.setAttributes(attributes);
        return userDetails;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return String.valueOf(id);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Mặc định tất cả user đều có role USER
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // Sử dụng email làm username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

