package com.faruk.service.register;

import com.faruk.dto.auth.AuthRequest;
import com.faruk.dto.auth.AuthResponse;
import com.faruk.dto.auth.RefreshTokenRequest;
import com.faruk.dto.user.DtoUser;
import com.faruk.jwt.JwtService;
import com.faruk.model.RefreshToken;
import com.faruk.model.User;
import com.faruk.repository.RefreshTokenRepository;
import com.faruk.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService implements IAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Autowired
    private JwtService jwtService;

    @Override
    public DtoUser register(AuthRequest request) {
        DtoUser dtoUser = new DtoUser();

        User savedUser = userRepository.save(createUser(request));
        BeanUtils.copyProperties(savedUser, dtoUser);

        return dtoUser;
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        authenticationProvider.authenticate(authenticationToken);

        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());

        String accessToken = jwtService.generateToken(optionalUser.get());
        RefreshToken refreshToken = refreshTokenRepository.save(createRefreshToken(optionalUser.get()));

        return new AuthResponse(accessToken, refreshToken.getRefreshToken());
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        Optional<RefreshToken> optionalRefreshToken = refreshTokenRepository.findByRefreshToken(request.getRefreshToken());
        if (optionalRefreshToken.isEmpty()) {
            return null;
        }

        if (!isValidRefreshToken(optionalRefreshToken.get().getExpiredDate())) {
            return null;
        }

        User user = optionalRefreshToken.get().getUser();
        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenRepository.save(createRefreshToken(user));

        return new AuthResponse(accessToken, refreshToken.getRefreshToken());
    }

    private User createUser(AuthRequest input) {
        User user = new User();

        user.setUsername(input.getUsername());
        user.setPassword(passwordEncoder.encode(input.getPassword()));

        return user;
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(user);
        refreshToken.setExpiredDate(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 4));
        refreshToken.setRefreshToken(UUID.randomUUID().toString());

        return refreshToken;
    }

    public boolean isValidRefreshToken(Date expiredDate) {
        return new Date().before(expiredDate);
    }
}
