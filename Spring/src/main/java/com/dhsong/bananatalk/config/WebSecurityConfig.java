package com.dhsong.bananatalk.config;

import com.dhsong.bananatalk.security.JwtAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

@EnableWebSecurity
@Configuration
@Slf4j
public class WebSecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults()) //WebMvcConfig에서 이미 설정했으므로 기본 cors 설정
                .csrf(csrf -> csrf.disable()) // csrf는 현재 사용하지 않으므로 disable
                .httpBasic(HttpBasicConfigurer::disable) // token을 사용하므로 basic인증 disable
                .sessionManagement(session -> session //세션 기반이 아님을 선언
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers( "/", "/auth/signin","/auth/signup", "/ws/**").permitAll() // 다음 경로는 인증 안해도 됨
                        .anyRequest().authenticated()) // 나머지 경로는 모두 인증 해야됨.
                .addFilterAfter(jwtAuthenticationFilter, CorsFilter.class); // filter등록. 매 요청마다 corsfilter 이후에 실행

        return http.build();
    }
}
