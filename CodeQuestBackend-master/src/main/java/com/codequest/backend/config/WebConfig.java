package com.codequest.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://code-quest-frontend-three.vercel.app")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
