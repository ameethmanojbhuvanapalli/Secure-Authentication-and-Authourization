package com.nmam.mfa.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public String getHello() {
        return "Hello World";
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public String gettHelloWithUser(@RequestBody String user) {
        return "Hello " + user;
    }
}
