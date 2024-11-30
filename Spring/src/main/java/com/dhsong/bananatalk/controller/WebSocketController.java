package com.dhsong.bananatalk.controller;

import com.dhsong.bananatalk.dto.WebSocketDTO;
import com.dhsong.bananatalk.model.FriendEntity;
import com.dhsong.bananatalk.model.FriendshipStatus;
import com.dhsong.bananatalk.model.UserEntity;
import com.dhsong.bananatalk.persistence.FriendRepository;
import com.dhsong.bananatalk.persistence.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendRepository friendRepository;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/sendMessage") // 클라이언트가 /app/sendMessage로 전송할 때 처리
    @SendTo("/topic/messages") // 모든 구독자에게 /topic/messages 경로로 전송
    public WebSocketDTO broadcastMessage(WebSocketDTO message) {
        return message; // 받은 메시지를 그대로 반환하여 구독자들에게 전달
    }

    @MessageMapping("/sendPrivateMessage/{userID}") // 클라이언트가 /app/sendPrivateMessage로 전송할 때 처리
    public void sendPrivateMessage(@DestinationVariable("userID")String userID, WebSocketDTO message) {
        log.info("message is delivered");
        // 특정 사용자에게 메시지를 보냄
        messagingTemplate.convertAndSend("/topic/" + userID, message);
    }

    @MessageMapping("/friend/{userID}") // 클라이언트가 /app/friend로 전송할 때 처리
    public void sendAskFriendMessage(@DestinationVariable("userID")String userID, WebSocketDTO message) {
        log.info("friend kind message is delivered");
        String kind = message.getContent();
        if(kind.equals("ask")){
            String from = message.getSender();
            String to = message.getReceiver();
            UserEntity From = userRepository.findByUsername(from);

            //해당 친구가 존재하는지 검사
            if(!userRepository.existsByUsername(to)) {
                log.warn("Such friend don't exists {}", to);
                throw new RuntimeException("Friend No exists");
            }

            UserEntity To = userRepository.findByUsername(to);
            FriendEntity friend = friendRepository.findByUserAndUser(From, To);

            if (friend != null) {
                // 상태에 따른 처리
                if (friend.getStatus() == FriendshipStatus.PENDING) {
                    log.warn("Friend request already sent from {} to {}", from, to);
                    return; // 이미 요청을 보냈으므로 작업 중단
                } else if (friend.getStatus() == FriendshipStatus.ACCEPTED) {
                    log.warn("{} and {} are already friends", from, to);
                    return; // 이미 친구이므로 작업 중단
                }
            }

            FriendEntity newFriend = FriendEntity.builder()
                    .user(From)
                    .friend(To)
                    .status(FriendshipStatus.PENDING)
                    .build();

            FriendEntity savedFriend = friendRepository.save(newFriend);
            log.info("Friend request saved: {}", savedFriend.getId());


            // 특정 사용자에게 메시지를 보냄
            messagingTemplate.convertAndSend("/topic/friend/" + userID, message);

        } else if(kind.equals("accept")){
            String from = message.getSender();
            String to = message.getReceiver();
            UserEntity From = userRepository.findByUsername(from);
            UserEntity To = userRepository.findByUsername(to);

            // From 에서 To로 가는 요청 새로 생성
            FriendEntity friend1 = FriendEntity.builder().user(From).friend(To).status(FriendshipStatus.ACCEPTED).build();
            FriendEntity savedFriend1 = friendRepository.save(friend1);
            log.info("{} to {}relationship has saved", from, to);

            //기존 친구요청 pending에서 accepted로 수정
            FriendEntity friend2 = friendRepository.findByUserAndUser(To, From);
            friend2.setStatus(FriendshipStatus.ACCEPTED);
            FriendEntity savedFriend2 = friendRepository.save(friend2);
            log.info("{} to {}relationship has saved", to, from);

            // 특정 사용자에게 메시지를 보냄
            messagingTemplate.convertAndSend("/topic/friend/" + userID, message);
        }else {
            //reject
            String from = message.getSender();
            String to = message.getReceiver();
            UserEntity From = userRepository.findByUsername(from);
            UserEntity To = userRepository.findByUsername(to);

            // To -> From 요청 삭제해야함
            FriendEntity friend = friendRepository.findByUserAndUser(To, From);
            friendRepository.delete(friend);
            log.info("{} to {}relationship has deleted", to, from);

            // 특정 사용자에게 메시지를 보냄
            messagingTemplate.convertAndSend("/topic/friend/" + userID, message);
        }

    }
}
