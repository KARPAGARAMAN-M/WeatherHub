package com.weatherhub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@SuppressWarnings("unchecked")
public class WeatherService {

    @Value("${openweather.api.key:}")
    private String defaultApiKey;

    @Value("${openweather.api.base-url:https://api.openweathermap.org}")
    private String baseUrl;

    private static final String OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
    private static final String OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
    private static final String OPEN_METEO_AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

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

        if (!apiKey.isEmpty()) {
            try {
                UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + "/data/2.5/weather")
                        .queryParam("appid", apiKey)
                        .queryParam("units", "metric");

                if (lat != null && lon != null) {
                    builder.queryParam("lat", lat).queryParam("lon", lon);
                } else if (city != null && !city.trim().isEmpty()) {
                    builder.queryParam("q", city.trim());
                } else {
                    builder.queryParam("lat", 13.0827).queryParam("lon", 80.2707);
                }

                Map<String, Object> res = restTemplate.getForObject(builder.toUriString(), Map.class);
                if (res != null && res.containsKey("main")) return res;
            } catch (Exception e) {
                System.err.println("OWM API call failed, falling back to Open-Meteo: " + e.getMessage());
            }
        }

        // Fetch live weather from Open-Meteo (No API Key required)
        try {
            Map<String, Object> omWeather = fetchOpenMeteoCurrentWeather(city, lat, lon);
            if (omWeather != null && !omWeather.isEmpty()) {
                return omWeather;
            }
        } catch (Exception e) {
            System.err.println("Open-Meteo API call failed: " + e.getMessage());
        }

        return Collections.emptyMap();
    }

    public Map<String, Object> getForecast(String city, Double lat, Double lon, String customKey) {
        String apiKey = resolveApiKey(customKey);

        if (!apiKey.isEmpty()) {
            try {
                UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + "/data/2.5/forecast")
                        .queryParam("appid", apiKey)
                        .queryParam("units", "metric");

                if (lat != null && lon != null) {
                    builder.queryParam("lat", lat).queryParam("lon", lon);
                } else if (city != null && !city.trim().isEmpty()) {
                    builder.queryParam("q", city.trim());
                } else {
                    builder.queryParam("lat", 13.0827).queryParam("lon", 80.2707);
                }

                Map<String, Object> res = restTemplate.getForObject(builder.toUriString(), Map.class);
                if (res != null && res.containsKey("list")) return res;
            } catch (Exception e) {
                System.err.println("OWM Forecast call failed, falling back to Open-Meteo: " + e.getMessage());
            }
        }

        // Fetch live forecast from Open-Meteo (No API Key required)
        try {
            Map<String, Object> omForecast = fetchOpenMeteoForecast(city, lat, lon);
            if (omForecast != null && !omForecast.isEmpty()) {
                return omForecast;
            }
        } catch (Exception e) {
            System.err.println("Open-Meteo Forecast call failed: " + e.getMessage());
        }

        return Collections.emptyMap();
    }

    public Map<String, Object> getAirPollution(Double lat, Double lon, String customKey) {
        String apiKey = resolveApiKey(customKey);

        if (!apiKey.isEmpty() && lat != null && lon != null) {
            try {
                String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/data/2.5/air_pollution")
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .queryParam("appid", apiKey)
                        .toUriString();

                Map<String, Object> res = restTemplate.getForObject(url, Map.class);
                if (res != null && res.containsKey("list")) return res;
            } catch (Exception e) {
                System.err.println("OWM Pollution call failed, falling back to Open-Meteo: " + e.getMessage());
            }
        }

        // Fetch live air pollution from Open-Meteo (No API Key required)
        try {
            Map<String, Object> omPollution = fetchOpenMeteoAirPollution(lat, lon);
            if (omPollution != null && !omPollution.isEmpty()) {
                return omPollution;
            }
        } catch (Exception e) {
            System.err.println("Open-Meteo Pollution call failed: " + e.getMessage());
        }

        return Collections.emptyMap();
    }

    public List<Map<String, Object>> getGeocoding(String query, String customKey) {
        String apiKey = resolveApiKey(customKey);

        if (!apiKey.isEmpty() && query != null && !query.trim().isEmpty()) {
            try {
                String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/geo/1.0/direct")
                        .queryParam("q", query.trim())
                        .queryParam("limit", 8)
                        .queryParam("appid", apiKey)
                        .toUriString();

                Object[] results = restTemplate.getForObject(url, Object[].class);
                if (results != null && results.length > 0) {
                    List<Map<String, Object>> list = new ArrayList<>();
                    for (Object obj : results) {
                        if (obj instanceof Map) {
                            list.add((Map<String, Object>) obj);
                        }
                    }
                    if (!list.isEmpty()) return list;
                }
            } catch (Exception e) {
                System.err.println("OWM Geocoding call failed, falling back to Open-Meteo: " + e.getMessage());
            }
        }

        // Fetch geocoding from Open-Meteo (No API Key required)
        try {
            List<Map<String, Object>> omGeo = fetchOpenMeteoGeocoding(query);
            if (omGeo != null && !omGeo.isEmpty()) {
                return omGeo;
            }
        } catch (Exception e) {
            System.err.println("Open-Meteo Geocoding call failed: " + e.getMessage());
        }

        return Collections.emptyList();
    }

    public List<Map<String, Object>> getReverseGeocoding(Double lat, Double lon, String customKey) {
        if (lat == null || lon == null) return Collections.emptyList();
        String apiKey = resolveApiKey(customKey);

        if (!apiKey.isEmpty()) {
            try {
                String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/geo/1.0/reverse")
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .queryParam("limit", 5)
                        .queryParam("appid", apiKey)
                        .toUriString();

                Object[] results = restTemplate.getForObject(url, Object[].class);
                if (results != null && results.length > 0) {
                    List<Map<String, Object>> list = new ArrayList<>();
                    for (Object obj : results) {
                        if (obj instanceof Map) {
                            list.add((Map<String, Object>) obj);
                        }
                    }
                    if (!list.isEmpty()) return list;
                }
            } catch (Exception e) {
                System.err.println("OWM Reverse Geocoding call failed, falling back to BigDataCloud: " + e.getMessage());
            }
        }

        // Free reverse geocoding via BigDataCloud client API (No API key required)
        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://api.bigdatacloud.net/data/reverse-geocode-client")
                    .queryParam("latitude", lat)
                    .queryParam("longitude", lon)
                    .queryParam("localityLanguage", "en")
                    .toUriString();

            Map<String, Object> res = restTemplate.getForObject(url, Map.class);
            if (res != null && !res.isEmpty()) {
                Map<String, Object> map = new HashMap<>();
                String locality = (String) res.getOrDefault("locality", "");
                String city = (String) res.getOrDefault("city", "");
                String state = (String) res.getOrDefault("principalSubdivision", "");
                String country = (String) res.getOrDefault("countryCode", "");
                String district = "";

                if (res.get("localityInfo") instanceof Map) {
                    Map locInfo = (Map) res.get("localityInfo");
                    if (locInfo.get("administrative") instanceof List) {
                        List adminList = (List) locInfo.get("administrative");
                        for (Object item : adminList) {
                            if (item instanceof Map) {
                                Map aMap = (Map) item;
                                String desc = String.valueOf(aMap.getOrDefault("description", "")).toLowerCase();
                                if (desc.contains("district") && aMap.containsKey("name")) {
                                    district = (String) aMap.get("name");
                                    break;
                                }
                            }
                        }
                    }
                }

                String displayName = !locality.isEmpty() ? locality : (!city.isEmpty() ? city : (!state.isEmpty() ? state : "Current Location"));

                map.put("name", displayName);
                map.put("locality", locality);
                map.put("city", city);
                map.put("district", district);
                map.put("state", state);
                map.put("country", country);
                map.put("lat", lat);
                map.put("lon", lon);
                return Collections.singletonList(map);
            }
        } catch (Exception e) {
            System.err.println("BigDataCloud Reverse Geocoding call failed: " + e.getMessage());
        }

        Map<String, Object> map = new HashMap<>();
        map.put("name", "Location (" + String.format("%.2f", lat) + ", " + String.format("%.2f", lon) + ")");
        map.put("lat", lat);
        map.put("lon", lon);
        return Collections.singletonList(map);
    }

    // --- Open-Meteo Adapters ---

    private Map<String, Object> fetchOpenMeteoCurrentWeather(String city, Double lat, Double lon) {
        double finalLat = 13.0827;
        double finalLon = 80.2707;
        String cityName = "Chennai";
        String countryCode = "IN";

        if (lat != null && lon != null) {
            finalLat = lat;
            finalLon = lon;
            if (city != null && !city.trim().isEmpty()) {
                cityName = sanitizeCityName(city);
            } else {
                List<Map<String, Object>> rev = getReverseGeocoding(lat, lon, "");
                if (rev != null && !rev.isEmpty()) {
                    cityName = (String) rev.get(0).getOrDefault("name", "Current Location");
                    countryCode = (String) rev.get(0).getOrDefault("country", countryCode);
                }
            }
        } else if (city != null && !city.trim().isEmpty()) {
            cityName = sanitizeCityName(city);
            List<Map<String, Object>> geo = fetchOpenMeteoGeocoding(cityName);
            if (geo != null && !geo.isEmpty()) {
                Map<String, Object> first = geo.get(0);
                finalLat = ((Number) first.get("lat")).doubleValue();
                finalLon = ((Number) first.get("lon")).doubleValue();
                if (first.containsKey("name")) cityName = (String) first.get("name");
                if (first.containsKey("country")) countryCode = (String) first.get("country");
            }
        }

        String url = UriComponentsBuilder.fromHttpUrl(OPEN_METEO_FORECAST_URL)
                .queryParam("latitude", finalLat)
                .queryParam("longitude", finalLon)
                .queryParam("current", "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m")
                .queryParam("daily", "sunrise,sunset,temperature_2m_max,temperature_2m_min")
                .queryParam("wind_speed_unit", "ms")
                .queryParam("timezone", "auto")
                .toUriString();

        Map<String, Object> res = restTemplate.getForObject(url, Map.class);
        if (res == null || !res.containsKey("current")) return null;

        Map<String, Object> current = (Map<String, Object>) res.get("current");
        Map<String, Object> daily = (Map<String, Object>) res.get("daily");

        int tzOffsetSeconds = 0;
        if (res.containsKey("utc_offset_seconds")) {
            tzOffsetSeconds = ((Number) res.get("utc_offset_seconds")).intValue();
        }

        double temp = ((Number) current.getOrDefault("temperature_2m", 25.0)).doubleValue();
        double feelsLike = ((Number) current.getOrDefault("apparent_temperature", temp)).doubleValue();
        double humidity = ((Number) current.getOrDefault("relative_humidity_2m", 60)).doubleValue();
        double pressure = ((Number) current.getOrDefault("surface_pressure", current.getOrDefault("pressure_msl", 1013))).doubleValue();
        double windSpeed = ((Number) current.getOrDefault("wind_speed_10m", 3.0)).doubleValue();
        double windDeg = ((Number) current.getOrDefault("wind_direction_10m", 180)).doubleValue();
        double clouds = ((Number) current.getOrDefault("cloud_cover", 20)).doubleValue();
        int isDay = ((Number) current.getOrDefault("is_day", 1)).intValue();
        int wmoCode = ((Number) current.getOrDefault("weather_code", 0)).intValue();

        double tempMax = temp + 3.0;
        double tempMin = temp - 3.0;
        if (daily != null && daily.containsKey("temperature_2m_max") && daily.get("temperature_2m_max") instanceof List) {
            List maxList = (List) daily.get("temperature_2m_max");
            if (!maxList.isEmpty() && maxList.get(0) instanceof Number) tempMax = ((Number) maxList.get(0)).doubleValue();
        }
        if (daily != null && daily.containsKey("temperature_2m_min") && daily.get("temperature_2m_min") instanceof List) {
            List minList = (List) daily.get("temperature_2m_min");
            if (!minList.isEmpty() && minList.get(0) instanceof Number) tempMin = ((Number) minList.get(0)).doubleValue();
        }

        long sunriseEpoch = System.currentTimeMillis() / 1000 - 21600;
        long sunsetEpoch = System.currentTimeMillis() / 1000 + 21600;
        if (daily != null && daily.containsKey("sunrise") && daily.get("sunrise") instanceof List) {
            List sunriseList = (List) daily.get("sunrise");
            if (!sunriseList.isEmpty()) sunriseEpoch = parseIsoToEpochSeconds((String) sunriseList.get(0)) - tzOffsetSeconds;
        }
        if (daily != null && daily.containsKey("sunset") && daily.get("sunset") instanceof List) {
            List sunsetList = (List) daily.get("sunset");
            if (!sunsetList.isEmpty()) sunsetEpoch = parseIsoToEpochSeconds((String) sunsetList.get(0)) - tzOffsetSeconds;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("name", cityName);

        Map<String, Object> coord = new HashMap<>();
        coord.put("lat", finalLat);
        coord.put("lon", finalLon);
        result.put("coord", coord);

        List<Map<String, Object>> weatherList = new ArrayList<>();
        weatherList.add(mapWmoCode(wmoCode, isDay == 1));
        result.put("weather", weatherList);

        Map<String, Object> mainMap = new HashMap<>();
        mainMap.put("temp", Math.round(temp * 10.0) / 10.0);
        mainMap.put("feels_like", Math.round(feelsLike * 10.0) / 10.0);
        mainMap.put("temp_min", Math.round(tempMin * 10.0) / 10.0);
        mainMap.put("temp_max", Math.round(tempMax * 10.0) / 10.0);
        mainMap.put("pressure", (int) Math.round(pressure));
        mainMap.put("humidity", (int) Math.round(humidity));
        result.put("main", mainMap);

        Map<String, Object> windMap = new HashMap<>();
        windMap.put("speed", Math.round(windSpeed * 10.0) / 10.0);
        windMap.put("deg", (int) Math.round(windDeg));
        result.put("wind", windMap);

        Map<String, Object> cloudsMap = new HashMap<>();
        cloudsMap.put("all", (int) Math.round(clouds));
        result.put("clouds", cloudsMap);

        result.put("visibility", 10000);
        result.put("dt", System.currentTimeMillis() / 1000);
        result.put("timezone", tzOffsetSeconds);

        Map<String, Object> sysMap = new HashMap<>();
        sysMap.put("country", countryCode);
        sysMap.put("sunrise", sunriseEpoch);
        sysMap.put("sunset", sunsetEpoch);
        result.put("sys", sysMap);

        return result;
    }

    private Map<String, Object> fetchOpenMeteoForecast(String city, Double lat, Double lon) {
        double finalLat = 13.0827;
        double finalLon = 80.2707;

        if (lat != null && lon != null) {
            finalLat = lat;
            finalLon = lon;
        } else if (city != null && !city.trim().isEmpty()) {
            List<Map<String, Object>> geo = fetchOpenMeteoGeocoding(city);
            if (geo != null && !geo.isEmpty()) {
                finalLat = ((Number) geo.get(0).get("lat")).doubleValue();
                finalLon = ((Number) geo.get(0).get("lon")).doubleValue();
            }
        }

        String url = UriComponentsBuilder.fromHttpUrl(OPEN_METEO_FORECAST_URL)
                .queryParam("latitude", finalLat)
                .queryParam("longitude", finalLon)
                .queryParam("hourly", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m")
                .queryParam("wind_speed_unit", "ms")
                .queryParam("timezone", "auto")
                .toUriString();

        Map<String, Object> res = restTemplate.getForObject(url, Map.class);
        if (res == null || !res.containsKey("hourly")) return null;

        Map<String, Object> hourly = (Map<String, Object>) res.get("hourly");
        List<String> timeList = (List<String>) hourly.get("time");
        List<Number> temp2mList = (List<Number>) hourly.get("temperature_2m");
        List<Number> humidityList = (List<Number>) hourly.get("relative_humidity_2m");
        List<Number> wmoCodeList = (List<Number>) hourly.get("weather_code");
        List<Number> pressureList = (List<Number>) hourly.get("surface_pressure");
        List<Number> windSpeedList = (List<Number>) hourly.get("wind_speed_10m");
        List<Number> popList = (List<Number>) hourly.get("precipitation_probability");

        if (timeList == null || timeList.isEmpty()) return null;

        List<Map<String, Object>> forecastList = new ArrayList<>();
        // Open-Meteo returns 1-hour slots. We take every 3rd slot to match OpenWeather's 3-hour forecast format (40 slots)
        for (int i = 0; i < timeList.size() && forecastList.size() < 40; i += 3) {
            long epochSec = parseIsoToEpochSeconds(timeList.get(i));
            double temp = (temp2mList != null && i < temp2mList.size() && temp2mList.get(i) != null) ? temp2mList.get(i).doubleValue() : 25.0;
            double hum = (humidityList != null && i < humidityList.size() && humidityList.get(i) != null) ? humidityList.get(i).doubleValue() : 60.0;
            int code = (wmoCodeList != null && i < wmoCodeList.size() && wmoCodeList.get(i) != null) ? wmoCodeList.get(i).intValue() : 0;
            double press = (pressureList != null && i < pressureList.size() && pressureList.get(i) != null) ? pressureList.get(i).doubleValue() : 1013.0;
            double windSpd = (windSpeedList != null && i < windSpeedList.size() && windSpeedList.get(i) != null) ? windSpeedList.get(i).doubleValue() : 3.0;
            double pop = (popList != null && i < popList.size() && popList.get(i) != null) ? popList.get(i).doubleValue() / 100.0 : 0.0;

            int hourOfSlot = LocalDateTime.ofEpochSecond(epochSec, 0, ZoneOffset.UTC).getHour();
            boolean isDaySlot = (hourOfSlot >= 6 && hourOfSlot < 19);

            Map<String, Object> item = new HashMap<>();
            item.put("dt", epochSec);

            Map<String, Object> mainMap = new HashMap<>();
            mainMap.put("temp", Math.round(temp * 10.0) / 10.0);
            mainMap.put("feels_like", Math.round(temp * 10.0) / 10.0);
            mainMap.put("temp_min", Math.round((temp - 1.5) * 10.0) / 10.0);
            mainMap.put("temp_max", Math.round((temp + 1.5) * 10.0) / 10.0);
            mainMap.put("humidity", (int) Math.round(hum));
            mainMap.put("pressure", (int) Math.round(press));
            item.put("main", mainMap);

            List<Map<String, Object>> weatherList = new ArrayList<>();
            weatherList.add(mapWmoCode(code, isDaySlot));
            item.put("weather", weatherList);

            Map<String, Object> windMap = new HashMap<>();
            windMap.put("speed", Math.round(windSpd * 10.0) / 10.0);
            windMap.put("deg", 180);
            item.put("wind", windMap);

            item.put("pop", pop);
            item.put("dt_txt", timeList.get(i));

            forecastList.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("list", forecastList);
        return result;
    }

    private Map<String, Object> fetchOpenMeteoAirPollution(Double lat, Double lon) {
        double finalLat = (lat != null) ? lat : 13.0827;
        double finalLon = (lon != null) ? lon : 80.2707;

        String url = UriComponentsBuilder.fromHttpUrl(OPEN_METEO_AIR_QUALITY_URL)
                .queryParam("latitude", finalLat)
                .queryParam("longitude", finalLon)
                .queryParam("current", "european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone")
                .toUriString();

        Map<String, Object> res = restTemplate.getForObject(url, Map.class);
        if (res == null || !res.containsKey("current")) return null;

        Map<String, Object> current = (Map<String, Object>) res.get("current");
        int eAqi = ((Number) current.getOrDefault("european_aqi", current.getOrDefault("us_aqi", 25))).intValue();

        int owAqi = 1;
        if (eAqi > 80) owAqi = 5;
        else if (eAqi > 60) owAqi = 4;
        else if (eAqi > 40) owAqi = 3;
        else if (eAqi > 20) owAqi = 2;

        Map<String, Object> compMap = new HashMap<>();
        compMap.put("pm2_5", Math.round(((Number) current.getOrDefault("pm2_5", 12.0)).doubleValue() * 10.0) / 10.0);
        compMap.put("pm10", Math.round(((Number) current.getOrDefault("pm10", 25.0)).doubleValue() * 10.0) / 10.0);
        compMap.put("no2", Math.round(((Number) current.getOrDefault("nitrogen_dioxide", 15.0)).doubleValue() * 10.0) / 10.0);
        compMap.put("o3", Math.round(((Number) current.getOrDefault("ozone", 45.0)).doubleValue() * 10.0) / 10.0);
        compMap.put("so2", Math.round(((Number) current.getOrDefault("sulphur_dioxide", 5.0)).doubleValue() * 10.0) / 10.0);
        compMap.put("co", Math.round(((Number) current.getOrDefault("carbon_monoxide", 200.0)).doubleValue() * 10.0) / 10.0);

        Map<String, Object> itemMap = new HashMap<>();
        Map<String, Object> mainMap = new HashMap<>();
        mainMap.put("aqi", owAqi);
        itemMap.put("main", mainMap);
        itemMap.put("components", compMap);
        itemMap.put("dt", System.currentTimeMillis() / 1000);

        List<Map<String, Object>> list = new ArrayList<>();
        list.add(itemMap);

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        return result;
    }

    private List<Map<String, Object>> fetchOpenMeteoGeocoding(String query) {
        if (query == null || query.trim().length() < 2) return Collections.emptyList();

        String url = UriComponentsBuilder.fromHttpUrl(OPEN_METEO_GEOCODING_URL)
                .queryParam("name", query.trim())
                .queryParam("count", 8)
                .queryParam("language", "en")
                .queryParam("format", "json")
                .toUriString();

        Map<String, Object> res = restTemplate.getForObject(url, Map.class);
        if (res == null || !res.containsKey("results")) return Collections.emptyList();

        List<Map<String, Object>> rawResults = (List<Map<String, Object>>) res.get("results");
        if (rawResults == null || rawResults.isEmpty()) return Collections.emptyList();

        List<Map<String, Object>> mappedList = new ArrayList<>();
        for (Map<String, Object> item : rawResults) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", item.getOrDefault("name", query));
            map.put("country", item.getOrDefault("country_code", "IN").toString().toUpperCase());
            map.put("lat", ((Number) item.get("latitude")).doubleValue());
            map.put("lon", ((Number) item.get("longitude")).doubleValue());
            if (item.containsKey("admin1")) {
                map.put("state", item.get("admin1"));
            }
            mappedList.add(map);
        }

        return mappedList;
    }

    private Map<String, Object> mapWmoCode(int code, boolean isDay) {
        String main;
        String description;
        String icon;

        switch (code) {
            case 0:
                main = "Clear";
                description = isDay ? "clear sky" : "clear night sky";
                icon = isDay ? "01d" : "01n";
                break;
            case 1:
                main = "Clear";
                description = isDay ? "mainly clear sky" : "mainly clear night";
                icon = isDay ? "01d" : "01n";
                break;
            case 2:
                main = "Clouds";
                description = "partly cloudy";
                icon = isDay ? "02d" : "02n";
                break;
            case 3:
                main = "Clouds";
                description = "overcast clouds";
                icon = isDay ? "04d" : "04n";
                break;
            case 45:
            case 48:
                main = "Fog";
                description = "foggy conditions";
                icon = "50d";
                break;
            case 51:
            case 53:
            case 55:
                main = "Drizzle";
                description = "light drizzle";
                icon = "09d";
                break;
            case 56:
            case 57:
                main = "Drizzle";
                description = "freezing drizzle";
                icon = "09d";
                break;
            case 61:
            case 63:
            case 65:
                main = "Rain";
                description = code == 61 ? "light rain" : (code == 63 ? "moderate rain" : "heavy rainfall");
                icon = isDay ? "10d" : "10n";
                break;
            case 66:
            case 67:
                main = "Rain";
                description = "freezing rain";
                icon = "10d";
                break;
            case 71:
            case 73:
            case 75:
            case 77:
                main = "Snow";
                description = "snowfall";
                icon = "13d";
                break;
            case 80:
            case 81:
            case 82:
                main = "Rain";
                description = "rain showers";
                icon = "09d";
                break;
            case 85:
            case 86:
                main = "Snow";
                description = "snow showers";
                icon = "13d";
                break;
            case 95:
            case 96:
            case 99:
                main = "Thunderstorm";
                description = "thunderstorm with rain";
                icon = "11d";
                break;
            default:
                main = "Clear";
                description = "clear sky";
                icon = isDay ? "01d" : "01n";
                break;
        }

        Map<String, Object> map = new HashMap<>();
        map.put("id", 800 + code);
        map.put("main", main);
        map.put("description", description);
        map.put("icon", icon);
        return map;
    }

    private long parseIsoToEpochSeconds(String isoStr) {
        if (isoStr == null || isoStr.isEmpty()) return System.currentTimeMillis() / 1000;
        try {
            if (isoStr.length() == 16) {
                isoStr += ":00";
            }
            LocalDateTime ldt = LocalDateTime.parse(isoStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            return ldt.toEpochSecond(ZoneOffset.UTC);
        } catch (Exception e) {
            return System.currentTimeMillis() / 1000;
        }
    }

    private String sanitizeCityName(String cityName) {
        if (cityName == null || cityName.trim().isEmpty()) return "Chennai";
        String trimmed = cityName.trim();
        return capitalize(trimmed);
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return "";
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}
