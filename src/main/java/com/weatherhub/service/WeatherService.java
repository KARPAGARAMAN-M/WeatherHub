package com.weatherhub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@Service
public class WeatherService {

    @Value("${openweather.api.key:}")
    private String defaultApiKey;

    @Value("${openweather.api.base-url:https://api.openweathermap.org}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private String resolveApiKey(String customKey) {
        if (customKey != null && !customKey.trim().isEmpty()) {
            return customKey.trim();
        }
        return defaultApiKey != null ? defaultApiKey.trim() : "";
    }

    public Map<String, Object> getCurrentWeather(String city, Double lat, Double lon, String customKey) {
        String apiKey = resolveApiKey(customKey);
        
        if (apiKey.isEmpty()) {
            return getMockCurrentWeather(city != null ? city : "London");
        }

        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + "/data/2.5/weather")
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric");

            if (lat != null && lon != null) {
                builder.queryParam("lat", lat).queryParam("lon", lon);
            } else if (city != null && !city.trim().isEmpty()) {
                builder.queryParam("q", city.trim());
            } else {
                builder.queryParam("q", "London");
            }

            return restTemplate.getForObject(builder.toUriString(), Map.class);
        } catch (Exception e) {
            System.err.println("OWM Current Weather fetch failed: " + e.getMessage() + ", falling back to mock data.");
            return getMockCurrentWeather(city != null ? city : "London");
        }
    }

    public Map<String, Object> getForecast(String city, Double lat, Double lon, String customKey) {
        String apiKey = resolveApiKey(customKey);

        if (apiKey.isEmpty()) {
            return getMockForecast(city != null ? city : "London");
        }

        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + "/data/2.5/forecast")
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric");

            if (lat != null && lon != null) {
                builder.queryParam("lat", lat).queryParam("lon", lon);
            } else if (city != null && !city.trim().isEmpty()) {
                builder.queryParam("q", city.trim());
            } else {
                builder.queryParam("q", "London");
            }

            return restTemplate.getForObject(builder.toUriString(), Map.class);
        } catch (Exception e) {
            System.err.println("OWM Forecast fetch failed: " + e.getMessage() + ", falling back to mock data.");
            return getMockForecast(city != null ? city : "London");
        }
    }

    public Map<String, Object> getAirPollution(Double lat, Double lon, String customKey) {
        String apiKey = resolveApiKey(customKey);

        if (apiKey.isEmpty()) {
            return getMockPollution();
        }

        try {
            double targetLat = lat != null ? lat : 51.5074;
            double targetLon = lon != null ? lon : -0.1278;

            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/data/2.5/air_pollution")
                    .queryParam("lat", targetLat)
                    .queryParam("lon", targetLon)
                    .queryParam("appid", apiKey)
                    .toUriString();

            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            System.err.println("OWM Air Pollution fetch failed: " + e.getMessage() + ", falling back to mock data.");
            return getMockPollution();
        }
    }

    public List<Map<String, Object>> getGeocoding(String query, String customKey) {
        String apiKey = resolveApiKey(customKey);

        if (apiKey.isEmpty() || query == null || query.trim().length() < 2) {
            return getMockGeocoding(query);
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/geo/1.0/direct")
                    .queryParam("q", query.trim())
                    .queryParam("limit", 5)
                    .queryParam("appid", apiKey)
                    .toUriString();

            Object[] results = restTemplate.getForObject(url, Object[].class);
            if (results == null) return Collections.emptyList();
            
            List<Map<String, Object>> list = new ArrayList<>();
            for (Object obj : results) {
                if (obj instanceof Map) {
                    list.add((Map<String, Object>) obj);
                }
            }
            return list;
        } catch (Exception e) {
            System.err.println("OWM Geocoding fetch failed: " + e.getMessage() + ", falling back to mock geocoding.");
            return getMockGeocoding(query);
        }
    }

    // --- Mock Data Engine ---
    private Map<String, Object> getMockCurrentWeather(String cityName) {
        Map<String, Object> res = new HashMap<>();
        res.put("name", cityName);

        Map<String, Object> sys = new HashMap<>();
        sys.put("country", "GB");
        sys.put("sunrise", System.currentTimeMillis() / 1000 - 18000);
        sys.put("sunset", System.currentTimeMillis() / 1000 + 18000);
        res.put("sys", sys);

        List<Map<String, Object>> weather = new ArrayList<>();
        Map<String, Object> w = new HashMap<>();
        String mainCond = "Clouds";
        String icon = "03d";

        String lower = cityName.toLowerCase();
        if (lower.contains("york")) { mainCond = "Clear"; icon = "01d"; }
        else if (lower.contains("tokyo")) { mainCond = "Rain"; icon = "10d"; }
        else if (lower.contains("paris")) { mainCond = "Clouds"; icon = "04d"; }
        else if (lower.contains("cairo")) { mainCond = "Clear"; icon = "01d"; }

        w.put("main", mainCond);
        w.put("description", mainCond.toLowerCase() + " sky");
        w.put("icon", icon);
        weather.add(w);
        res.put("weather", weather);

        Map<String, Object> main = new HashMap<>();
        main.put("temp", 22.5);
        main.put("feels_like", 22.0);
        main.put("temp_min", 18.0);
        main.put("temp_max", 25.0);
        main.put("pressure", 1015);
        main.put("humidity", 62);
        res.put("main", main);

        Map<String, Object> wind = new HashMap<>();
        wind.put("speed", 4.2);
        wind.put("deg", 210);
        res.put("wind", wind);

        res.put("visibility", 10000);
        res.put("dt", System.currentTimeMillis() / 1000);
        res.put("timezone", 3600);

        Map<String, Object> coord = new HashMap<>();
        coord.put("lat", 51.5074);
        coord.put("lon", -0.1278);
        res.put("coord", coord);

        return res;
    }

    private Map<String, Object> getMockForecast(String cityName) {
        Map<String, Object> res = new HashMap<>();
        List<Map<String, Object>> list = new ArrayList<>();
        long now = System.currentTimeMillis() / 1000;

        for (int i = 0; i < 40; i++) {
            Map<String, Object> item = new HashMap<>();
            long dt = now + (i * 3 * 3600);
            item.put("dt", dt);

            Map<String, Object> main = new HashMap<>();
            double temp = 20.0 + Math.sin(i * 0.5) * 5;
            main.put("temp", Math.round(temp * 10.0) / 10.0);
            main.put("temp_min", Math.round((temp - 2) * 10.0) / 10.0);
            main.put("temp_max", Math.round((temp + 2) * 10.0) / 10.0);
            main.put("humidity", 65);
            item.put("main", main);

            List<Map<String, Object>> weather = new ArrayList<>();
            Map<String, Object> w = new HashMap<>();
            w.put("main", "Clear");
            w.put("description", "clear sky");
            w.put("icon", "01d");
            weather.add(w);
            item.put("weather", weather);

            list.add(item);
        }

        res.put("list", list);
        return res;
    }

    private Map<String, Object> getMockPollution() {
        Map<String, Object> res = new HashMap<>();
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();

        Map<String, Object> main = new HashMap<>();
        main.put("aqi", 2);
        item.put("main", main);

        Map<String, Object> comp = new HashMap<>();
        comp.put("pm2_5", 12.5);
        comp.put("pm10", 24.1);
        comp.put("no2", 18.2);
        comp.put("o3", 42.0);
        item.put("components", comp);

        list.add(item);
        res.put("list", list);
        return res;
    }

    private List<Map<String, Object>> getMockGeocoding(String query) {
        if (query == null || query.trim().isEmpty()) return Collections.emptyList();
        String q = query.toLowerCase().trim();

        List<Map<String, Object>> list = new ArrayList<>();
        String[][] mockCities = {
                {"London", "GB", "51.5074", "-0.1278"},
                {"New York", "US", "40.7128", "-74.0060"},
                {"Tokyo", "JP", "35.6762", "139.6503"},
                {"Paris", "FR", "48.8566", "2.3522"},
                {"Sydney", "AU", "-33.8688", "151.2093"},
                {"Cairo", "EG", "30.0444", "31.2357"},
        };

        for (String[] c : mockCities) {
            if (c[0].toLowerCase().contains(q)) {
                Map<String, Object> map = new HashMap<>();
                map.put("name", c[0]);
                map.put("country", c[1]);
                map.put("lat", Double.parseDouble(c[2]));
                map.put("lon", Double.parseDouble(c[3]));
                list.add(map);
            }
        }
        return list;
    }
}
