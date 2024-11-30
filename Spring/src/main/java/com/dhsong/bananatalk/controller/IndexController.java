package com.dhsong.bananatalk.controller;

import com.dhsong.bananatalk.dto.ResponseDTO;
import com.dhsong.bananatalk.dto.UserDTO;
import com.dhsong.bananatalk.security.TokenProvider;
import com.dhsong.bananatalk.service.UserService;
import com.dhsong.bananatalk.model.UserEntity;
import com.dhsong.bananatalk.security.TokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
public class IndexController {

    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Welcome to the home page!");
    }
}

