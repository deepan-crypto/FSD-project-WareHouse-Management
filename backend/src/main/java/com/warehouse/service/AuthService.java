package com.warehouse.service;

import com.warehouse.dto.request.LoginRequest;
import com.warehouse.dto.request.RegisterRequest;
import com.warehouse.dto.response.JwtResponse;
import com.warehouse.dto.response.MessageResponse;
import com.warehouse.entity.Role;
import com.warehouse.entity.User;
import com.warehouse.entity.enums.RoleName;
import com.warehouse.exception.BadRequestException;
import com.warehouse.repository.RoleRepository;
import com.warehouse.repository.UserRepository;
import com.warehouse.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already registered");
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        // Assign role
        Set<Role> roles = new HashSet<>();
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            Role adminRole = roleRepository.findByRoleName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new BadRequestException("Admin role not found in system"));
            roles.add(adminRole);
        } else {
            Role staffRole = roleRepository.findByRoleName(RoleName.ROLE_STAFF)
                    .orElseThrow(() -> new BadRequestException("Staff role not found in system"));
            roles.add(staffRole);
        }
        user.setRoles(roles);

        userRepository.save(user);

        return MessageResponse.builder()
                .message("User registered successfully!")
                .success(true)
                .build();
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }
}
