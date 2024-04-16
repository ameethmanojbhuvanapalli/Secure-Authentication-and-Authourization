package com.nmam.mfa.controller;


import com.nmam.mfa.dto.JwtResponse;
import com.nmam.mfa.dto.LoginRequest;
import com.nmam.mfa.dto.RegisterResponse;
import com.nmam.mfa.dto.UserRequest;
import com.nmam.mfa.model.User;
import com.nmam.mfa.service.UserService;
import com.nmam.mfa.tfa.TwoFactorAuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CookieValue;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<RegisterResponse> addUser(@RequestBody UserRequest userRequest) {
        User user = userService.addUser(userRequest);
        return ResponseEntity.ok(new RegisterResponse(userRequest.getEmail(), TwoFactorAuthenticationService.generateQrcodeImageUri(user.getSecret())));
        //return "User added successfully";
    }
    @PostMapping("/sendemailotp")
    @ResponseStatus(HttpStatus.CREATED)
    public int sendEmailOtp(@RequestBody UserRequest userRequest) {
        int otp = userService.sendEmailOtp(userRequest);
        //return ResponseEntity.ok(new RegisterResponse(userRequest.getEmail(), TwoFactorAuthenticationService.generateQrcodeImageUri(user.getSecret())));
        return otp;
    }
    @PostMapping("/validatecode")
    public ResponseEntity<RegisterResponse> validateSecretCode(@RequestBody UserRequest userRequest) {
        try {
           // return userService.validateUserSecretCode(userRequest);
            return ResponseEntity.ok(new RegisterResponse(userRequest.getEmail(), String.valueOf(userService.validateUserSecretCode(userRequest))));
           // return ResponseEntity.ok(new JwtResponse(loginRequest.getEmail(), token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (AuthenticationServiceException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (AuthenticationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }
    }
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginUser(@RequestBody LoginRequest loginRequest,HttpServletResponse response) {
        String token="";

        String otpstr = loginRequest.getOtp();
        if(otpstr.equals("0")){
            User userFromDb = userService.getUser(loginRequest);
            int otpoption =  userFromDb.getMfaoption();
            if(otpoption==1){
                //System.out.println("otpoption is " + String.valueOf (otpoption));
                return ResponseEntity.ok(new JwtResponse(loginRequest.getEmail(), token,String.valueOf (otpoption),null));
            }
            if(otpoption==2){
                //System.out.println("otpoption is " + String.valueOf (otpoption));
                int otp = userService.sendEmailOtp(loginRequest);
                return ResponseEntity.ok(new JwtResponse(loginRequest.getEmail(), token,String.valueOf (otpoption),String.valueOf (otp)));
            }
        }
        try {
            token = userService.loginUser(loginRequest);
            if(token !=null) {
                User userFromDb = userService.getUser(loginRequest);
                int otpoption = userFromDb.getMfaoption();
                if (otpoption == 1) {
                    if (userService.validateUserSecretCode(loginRequest)) {
                        setCookie(response, token);
                        return ResponseEntity.ok(new JwtResponse(loginRequest.getEmail(), token, null, null));
                    } else {
                        return ResponseEntity.ok(new JwtResponse(loginRequest.getEmail(), null, null, null));
                    }
                    //return ResponseEntity.ok(new JwtResponse(loginRequest.getEmail(), token,String.valueOf (otpoption),null));
                }
                if (otpoption == 2) {
                    if (userService.validateUserEmailOtp(loginRequest)) {
                        setCookie(response, token);
                        return ResponseEntity.ok(new JwtResponse(loginRequest.getEmail(), token, null, null));
                    } else {
                        return ResponseEntity.ok(new JwtResponse(loginRequest.getEmail(), null, null, null));
                    }
                }
            }
            return ResponseEntity.ok(new JwtResponse(loginRequest.getEmail(), setCookie(response, token)+token,null,null));
        } catch (BadCredentialsException e) {
            // Handle bad credentials (incorrect username or password)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (AuthenticationServiceException e) {
            // Handle other authentication service-related exceptions
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (AuthenticationException e) {
            // Handle other general authentication exceptions
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/getToken")
    public String getCookieValue(@CookieValue(value = "token", defaultValue = "defaultToken") String token) {
        System.out.println(token);
        return token;
    }
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        setCookie(response,"");
        return ResponseEntity.ok("Logged out successfully");
    }
    public String setCookie(HttpServletResponse response, String token) {
        System.out.println(token);
        response.setHeader("Set-Cookie", "token=" + token + "; Path=/; HttpOnly");
        return "Cookie set successfully!";
    }

}
