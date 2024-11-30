package com.dhsong.bananatalk.controller;

import com.dhsong.bananatalk.dto.ResponseDTO;
import com.dhsong.bananatalk.dto.UserDTO;
import com.dhsong.bananatalk.model.UserEntity;
import com.dhsong.bananatalk.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @GetMapping
    public ResponseEntity<?> getAcceptedFriends(@AuthenticationPrincipal String userId) {
        List<UserEntity> friends = friendService.getFriends(userId);

        List<UserDTO> dtos = friends.stream().map(a -> new UserDTO(a)).collect(Collectors.toList());

        ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().data(dtos).build();

        return ResponseEntity.ok().body(response);
    }

}

