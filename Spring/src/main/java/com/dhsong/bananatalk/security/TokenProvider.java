package com.dhsong.bananatalk.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.dhsong.bananatalk.model.UserEntity;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.security.Key;

@Slf4j
@Service
public class TokenProvider {
    //임의로 지정한 secret key
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor("a2bC3dE4fG5hI6jK7lM8nO9pQ0rS1tU2vW3xY4zA5bC6dE7fG8hI9jK0lM1nO2pQ3rS4tU5vW6xY7zA8bC9dE0".getBytes());

    public String create(UserEntity userEntity) {
        //기한은 1일
        Date expiryDate = Date.from(Instant.now().plus(1, ChronoUnit.DAYS));

        return Jwts.builder()
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .setSubject(userEntity.getId())
                .setIssuer("bananatalk")
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .compact();
    }
    //클라이언트가 가져온 토큰 확인하는 부분
    public String validateAndGetUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
}
