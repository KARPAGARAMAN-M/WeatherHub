package com.weatherhub.controller;

import com.weatherhub.service.WeatherService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/current")
    public Map<String, Object> getCurrentWeather(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) String apiKey,
            @RequestHeader(name = "X-Api-Key", required = false) String headerApiKey
    ) {
        String key = (apiKey != null && !apiKey.isEmpty()) ? apiKey : headerApiKey;
        return weatherService.getCurrentWeather(city, lat, lon, key);
    }

    @GetMapping("/forecast")
    public Map<String, Object> getForecast(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) String apiKey,
            @RequestHeader(name = "X-Api-Key", required = false) String headerApiKey
    ) {
        String key = (apiKey != null && !apiKey.isEmpty()) ? apiKey : headerApiKey;
        return weatherService.getForecast(city, lat, lon, key);
    }

    @GetMapping("/pollution")
    public Map<String, Object> getAirPollution(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) String apiKey,
            @RequestHeader(name = "X-Api-Key", required = false) String headerApiKey
    ) {
        String key = (apiKey != null && !apiKey.isEmpty()) ? apiKey : headerApiKey;
        return weatherService.getAirPollution(lat, lon, key);
    }

    @GetMapping("/geocoding")
    public List<Map<String, Object>> getGeocoding(
            @RequestParam String query,
            @RequestParam(required = false) String apiKey,
            @RequestHeader(name = "X-Api-Key", required = false) String headerApiKey
    ) {
        String key = (apiKey != null && !apiKey.isEmpty()) ? apiKey : headerApiKey;
        return weatherService.getGeocoding(query, key);
    }

    @GetMapping("/health")
    public Map<String, String> getHealth() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("backend", "Java Spring Boot 3");
        health.put("service", "WeatherHub Backend API");
        return health;
    }
}
