package com.dhsong.bananatalk.dto;

import com.dhsong.bananatalk.model.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String token;
    private String username;
    private String password;
    private String id;

    public UserDTO(final UserEntity userEntity){
        this.id = userEntity.getId();
        this.username = userEntity.getUsername();
    }
}
