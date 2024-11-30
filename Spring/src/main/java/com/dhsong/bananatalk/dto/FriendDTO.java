package com.dhsong.bananatalk.dto;

import lombok.*;

@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendDTO {
    private String sender;
    private String receiver;
    private String content;
}
