package com.faruk.control.auth;

import com.faruk.dto.auth.AuthRequest;
import com.faruk.dto.auth.AuthResponse;
import com.faruk.dto.auth.RefreshTokenRequest;
import com.faruk.dto.user.DtoUser;

public interface IAuthControl {
    public DtoUser register(AuthRequest request);
    public AuthResponse authenticate(AuthRequest request);
    public AuthResponse refreshToken(RefreshTokenRequest request);
}
