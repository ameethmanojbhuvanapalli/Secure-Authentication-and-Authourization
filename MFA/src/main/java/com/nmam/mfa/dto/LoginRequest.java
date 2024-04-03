package com.nmam.mfa.dto;

import lombok.Getter;
import lombok.NonNull;

@Getter
public class LoginRequest {
    @NonNull
    private String email;
    @NonNull
    private String password;

    private String otp;
}