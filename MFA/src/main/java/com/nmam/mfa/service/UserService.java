package com.nmam.mfa.service;

import com.nmam.mfa.config.JwtProvider;
import com.nmam.mfa.dto.LoginRequest;
import com.nmam.mfa.dto.UserRequest;
import com.nmam.mfa.model.User;
import com.nmam.mfa.repository.UserRepository;
import com.nmam.mfa.tfa.EmailService;
import com.nmam.mfa.tfa.TwoFactorAuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    private final TwoFactorAuthenticationService tfaService;
    private final EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private JwtProvider jwtProvider;
    @Autowired
    private AuthenticationManager authenticationManager;

    public User addUser(UserRequest userRequest) {
        User user = User.builder()
                .name(userRequest.getName())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .roles(userRequest.getRoles())
                .mfaEnabled(userRequest.isMfaEnabled())
                .mfaoption(userRequest.getMfaoption())
              //  .timestamp(java.sql.Timestamp)
                .build();
       // if(userRequest.isMfaEnabled()){
            if(userRequest.getMfaoption()==1){
                user.setSecret(tfaService.generateNewSecrect());
                user.setIsUserActive(0);
            }
            else{
                user.setIsUserActive(1);
            }
         //   if(userRequest.getMfaoption()==2){
         //       user.setSecret(tfaService.generateNewSecrect());
         //   }

       // }

        userRepository.save(user);
        return user;
    }

    public int sendEmailOtp(UserRequest userRequest) {
        User userFromDb = userRepository.findByEmail(userRequest.getEmail());
        // crush the variables of the object found
        int eotp = generateEmailOtp();
        userFromDb.setEmailotp(eotp);

        userRepository.save(userFromDb);
       // emailService.sendEmail(userRequest.getEmail(),"Email OTP Verification-test","Your verification code is :" + String.valueOf(eotp));
        return eotp;
    }
    public int sendEmailOtp(LoginRequest loginRequest) {
        User userFromDb = userRepository.findByEmail(loginRequest.getEmail());
        // crush the variables of the object found
        int eotp = generateEmailOtp();
        userFromDb.setEmailotp(eotp);

        userRepository.save(userFromDb);
        emailService.sendEmail(userFromDb.getEmail(),"Email OTP Verification-test","Your verification code is :" + String.valueOf(eotp));
        return eotp;
    }
    private void activateUser(String userEmail) {
        User userFromDb = userRepository.findByEmail(userEmail);
        // crush the variables of the object found
        userFromDb.setIsUserActive(1);

        userRepository.save(userFromDb);

       // return true;
    }
    public boolean validateUserSecretCode(UserRequest userRequest) {
        User userFromDb = userRepository.findByEmail(userRequest.getEmail());
        // crush the variables of the object found
        String secret = userFromDb.getSecret();
        int isActive = userFromDb.getIsUserActive();

        boolean valid = tfaService.isOtpValid(secret,userRequest.getCode());
        if(valid){
            if(isActive==0){
                activateUser(userRequest.getEmail());
            }
            return true;
        }
        else
            {
                return false;
            }
       // return tfaService.isOtpValid(secret,userRequest.getCode());
    }
    public boolean validateUserSecretCode(LoginRequest loginRequest) {
        User userFromDb = userRepository.findByEmail(loginRequest.getEmail());
        // crush the variables of the object found
        String secret = userFromDb.getSecret();
        int isActive = userFromDb.getIsUserActive();

        boolean valid = tfaService.isOtpValid(secret,loginRequest.getOtp());
        if(valid){
            if(isActive==0){
                //activateUser(loginRequest.getEmail());
                return false;
            }
            return true;
        }
        else
        {
            return false;
        }
        // return tfaService.isOtpValid(secret,userRequest.getCode());
    }
    public boolean validateUserEmailOtp(LoginRequest loginRequest) {
        User userFromDb = userRepository.findByEmail(loginRequest.getEmail());
        // crush the variables of the object found
        String eotp = String.valueOf(userFromDb.getEmailotp());

        if(eotp.equals(loginRequest.getOtp())){
            userFromDb.setEmailotp(0);
            userRepository.save(userFromDb);
            return true;
        }
        else
        {
            return false;
        }
        // return tfaService.isOtpValid(secret,userRequest.getCode());
    }
    public String loginUser(LoginRequest loginRequest) throws BadCredentialsException {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());
        authenticationManager.authenticate(authenticationToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        return jwtProvider.generateToken(userDetails);
    }
    public User getUser(LoginRequest loginRequest) {

        return  userRepository.findByEmail(loginRequest.getEmail());
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public int generateEmailOtp(){
        Random randomNum = new Random();
        int otpNum= 100000 + randomNum.nextInt(900000);

        return otpNum;
    }
}
