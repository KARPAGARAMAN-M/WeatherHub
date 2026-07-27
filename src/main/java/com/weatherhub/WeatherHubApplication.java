package com.weatherhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class WeatherHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeatherHubApplication.class, args);
    }
}
