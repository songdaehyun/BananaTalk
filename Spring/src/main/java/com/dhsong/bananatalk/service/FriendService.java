package com.dhsong.bananatalk.service;

import com.dhsong.bananatalk.dto.FriendDTO;
import com.dhsong.bananatalk.model.FriendEntity;
import com.dhsong.bananatalk.model.FriendshipStatus;
import com.dhsong.bananatalk.model.UserEntity;
import com.dhsong.bananatalk.persistence.FriendRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class FriendService {

    @Autowired
    private FriendRepository friendRepository;

    public List<UserEntity> getFriends(String userId) {
        return friendRepository.findFriendsByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED);
    }

}
