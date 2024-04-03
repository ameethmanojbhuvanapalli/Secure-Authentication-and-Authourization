package com.nmam.mfa.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @GetMapping
    public String getHelloAuth(Principal principal) {
        return "Authenticated: " + principal.getName();
    }
}
