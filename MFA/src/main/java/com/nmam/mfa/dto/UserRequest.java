package com.nmam.mfa.dto;

import lombok.Data;

@Data
public class UserRequest {
    String name;
    String email;
    String password;
    String roles;


    boolean mfaEnabled;
    int mfaoption;
    String code;
   //public String secret;
}
