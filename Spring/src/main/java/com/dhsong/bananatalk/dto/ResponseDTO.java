package com.dhsong.bananatalk.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


//모든 응답은 이 형태로 반환된다.

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseDTO<T> {
    private String error;
    private List<T> data;
}
