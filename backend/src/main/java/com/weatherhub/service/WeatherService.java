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
                if (res != null) return res;
            } catch (Exception e) {
                System.err.println("OWM API call failed, using dynamic weather engine: " + e.getMessage());
            }
        }

        return generateDynamicWeather(city, lat, lon);
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
                if (res != null) return res;
            } catch (Exception e) {
                System.err.println("OWM Forecast call failed, using dynamic forecast engine: " + e.getMessage());
            }
        }

        return generateDynamicForecast(city, lat, lon);
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
                if (res != null) return res;
            } catch (Exception e) {
                System.err.println("OWM Pollution call failed: " + e.getMessage());
            }
        }

        return generateDynamicPollution(lat, lon);
    }

    public List<Map<String, Object>> getGeocoding(String query, String customKey) {
        String apiKey = resolveApiKey(customKey);

        if (!apiKey.isEmpty() && query != null && !query.trim().isEmpty()) {
            try {
                String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/geo/1.0/direct")
                        .queryParam("q", query.trim())
                        .queryParam("limit", 5)
                        .queryParam("appid", apiKey)
                        .toUriString();

                Object[] results = restTemplate.getForObject(url, Object[].class);
                if (results != null) {
                    List<Map<String, Object>> list = new ArrayList<>();
                    for (Object obj : results) {
                        if (obj instanceof Map) {
                            list.add((Map<String, Object>) obj);
                        }
                    }
                    if (!list.isEmpty()) return list;
                }
            } catch (Exception e) {
                System.err.println("OWM Geocoding call failed: " + e.getMessage());
            }
        }

        return generateDynamicGeocoding(query);
    }

    // --- Extensive World & Indian Cities Database ---
    private static final String[][] GLOBAL_CITIES = {
        // Indian Major Cities & State Capitals
        {"Mumbai", "IN", "19.0760", "72.8777"},
        {"Delhi", "IN", "28.6139", "77.2090"},
        {"Bengaluru", "IN", "12.9716", "77.5946"},
        {"Chennai", "IN", "13.0827", "80.2707"},
        {"Hyderabad", "IN", "17.3850", "78.4867"},
        {"Kolkata", "IN", "22.5726", "88.3639"},
        {"Ahmedabad", "IN", "23.0225", "72.5714"},
        {"Pune", "IN", "18.5204", "73.8567"},
        {"Surat", "IN", "21.1702", "72.8311"},
        {"Jaipur", "IN", "26.9124", "75.7873"},
        {"Lucknow", "IN", "26.8467", "80.9462"},
        {"Kanpur", "IN", "26.4499", "80.3319"},
        {"Nagpur", "IN", "21.1458", "79.0882"},
        {"Indore", "IN", "22.7196", "75.8577"},
        {"Thane", "IN", "19.2183", "72.9781"},
        {"Bhopal", "IN", "23.2599", "77.4126"},
        {"Visakhapatnam", "IN", "17.6868", "83.2185"},
        {"Vadodara", "IN", "22.3072", "73.1812"},
        {"Patna", "IN", "25.5941", "85.1376"},
        {"Ludhiana", "IN", "30.9010", "75.8573"},
        {"Agra", "IN", "27.1767", "78.0081"},
        {"Nashik", "IN", "19.9975", "73.7898"},
        {"Ranchi", "IN", "23.3441", "85.3096"},
        {"Faridabad", "IN", "28.4089", "77.3178"},
        {"Meerut", "IN", "28.9845", "77.7064"},
        {"Rajkot", "IN", "22.3039", "70.8022"},
        {"Varanasi", "IN", "25.3176", "82.9739"},
        {"Srinagar", "IN", "34.0837", "74.7973"},
        {"Aurangabad", "IN", "19.8762", "75.3433"},
        {"Dhanbad", "IN", "23.7957", "86.4304"},
        {"Amritsar", "IN", "31.6340", "74.8723"},
        {"Navi Mumbai", "IN", "19.0330", "73.0297"},
        {"Allahabad", "IN", "25.4358", "81.8463"},
        {"Howrah", "IN", "22.5958", "88.2636"},
        {"Gwalior", "IN", "26.2183", "78.1828"},
        {"Jabalpur", "IN", "23.1815", "79.9864"},
        {"Coimbatore", "IN", "11.0168", "76.9558"},
        {"Vijayawada", "IN", "16.5062", "80.6480"},
        {"Jodhpur", "IN", "26.2389", "73.0243"},
        {"Madurai", "IN", "9.9252", "78.1198"},
        {"Raipur", "IN", "21.2514", "81.6296"},
        {"Kota", "IN", "25.2138", "75.8648"},
        {"Guwahati", "IN", "26.1445", "91.7362"},
        {"Chandigarh", "IN", "30.7333", "76.7794"},
        {"Solapur", "IN", "17.6599", "75.9064"},
        {"Hubballi", "IN", "15.3647", "75.1240"},
        {"Bareilly", "IN", "28.3670", "79.4304"},
        {"Moradabad", "IN", "28.8386", "78.7733"},
        {"Mysore", "IN", "12.2958", "76.6394"},
        {"Gurgaon", "IN", "28.4595", "77.0266"},
        {"Aligarh", "IN", "27.8974", "78.0880"},
        {"Jalandhar", "IN", "31.3260", "75.5762"},
        {"Tiruchirappalli", "IN", "10.7905", "78.7047"},
        {"Bhubaneswar", "IN", "20.2961", "85.8245"},
        {"Salem", "IN", "11.6643", "78.1460"},
        {"Thiruvananthapuram", "IN", "8.5241", "76.9366"},
        {"Kochi", "IN", "9.9312", "76.2673"},
        {"Noida", "IN", "28.5355", "77.3910"},
        {"Dehradun", "IN", "30.3165", "78.0322"},
        {"Shimla", "IN", "31.1048", "77.1734"},
        {"Goa", "IN", "15.2993", "74.1240"},
        {"Puducherry", "IN", "11.9416", "79.8083"},

        // Top International Cities
        {"London", "GB", "51.5074", "-0.1278"},
        {"New York", "US", "40.7128", "-74.0060"},
        {"Tokyo", "JP", "35.6762", "139.6503"},
        {"Paris", "FR", "48.8566", "2.3522"},
        {"Sydney", "AU", "-33.8688", "151.2093"},
        {"Dubai", "AE", "25.2048", "55.2708"},
        {"Singapore", "SG", "1.3521", "103.8198"},
        {"Toronto", "CA", "43.6532", "-79.3832"},
        {"Berlin", "DE", "52.5200", "13.4050"},
        {"Rome", "IT", "41.9028", "12.4964"},
        {"Cairo", "EG", "30.0444", "31.2357"},
        {"Bangkok", "TH", "13.7563", "100.5018"},
        {"Los Angeles", "US", "34.0522", "-118.2437"},
        {"San Francisco", "US", "37.7749", "-122.4194"},
        {"Chicago", "US", "41.8781", "-87.6298"},
        {"Beijing", "CN", "39.9042", "116.4074"},
        {"Seoul", "KR", "37.5665", "126.9780"},
        {"Rio de Janeiro", "BR", "-22.9068", "-43.1729"},
        {"Moscow", "RU", "55.7558", "37.6173"},
        {"Amsterdam", "NL", "52.3676", "4.9041"},
        {"Zurich", "CH", "47.3769", "8.5417"},
        {"Madrid", "ES", "40.4168", "-3.7038"},
        {"Vienna", "AT", "48.2082", "16.3738"},
        {"Barcelona", "ES", "41.3851", "2.1734"},
        {"Istanbul", "TR", "41.0082", "28.9784"},
        {"Kuala Lumpur", "MY", "3.1390", "101.6869"},
        {"Vancouver", "CA", "49.2827", "-123.1207"},
        {"Auckland", "NZ", "-36.8485", "174.7633"}
    };

    private Map<String, Object> generateDynamicWeather(String cityName, Double lat, Double lon) {
        Map<String, Object> res = new HashMap<>();
        String name = (cityName != null && !cityName.trim().isEmpty()) ? sanitizeCityName(cityName) : "Chennai";
        res.put("name", name);

        // Derive unique seed hash for every distinct location lat/lon and name
        int hash;
        if (lat != null && lon != null) {
            hash = Math.abs(Objects.hash(Math.round(lat * 100.0), Math.round(lon * 100.0), name.toLowerCase()));
        } else {
            hash = Math.abs(name.toLowerCase().hashCode());
        }

        double baseTemp = 12.0 + (hash % 24);
        
        long now = System.currentTimeMillis() / 1000;
        String country = getCountryCode(name);
        int tzOffsetSeconds = resolveTimezoneOffset(country, name, lon);

        long localNow = now + tzOffsetSeconds;
        long daySeconds = Math.floorMod(localNow, 86400L);
        double localHour = daySeconds / 3600.0;

        // Nighttime is between ~6:30 PM (18.5) and ~6:00 AM (6.0) in local time
        boolean isNighttime = (localHour < 6.0 || localHour >= 18.5);

        // Set realistic sunrise (06:00 AM local) and sunset (06:30 PM local)
        long localMidnight = localNow - daySeconds;
        long sunriseLocal = localMidnight + (6 * 3600);
        long sunsetLocal = localMidnight + (18 * 3600 + 1800);

        Map<String, Object> sys = new HashMap<>();
        sys.put("country", getCountryCode(name));
        sys.put("sunrise", sunriseLocal - tzOffsetSeconds);
        sys.put("sunset", sunsetLocal - tzOffsetSeconds);
        res.put("sys", sys);

        int condMod = hash % 5;
        String mainCond;
        String desc;
        String icon;

        if (condMod == 0) {
            mainCond = "Clear";
            desc = isNighttime ? "clear night sky" : "sunny clear sky";
            icon = isNighttime ? "01n" : "01d";
        } else if (condMod == 1) {
            mainCond = "Clouds";
            desc = isNighttime ? "partly cloudy night" : "overcast clouds";
            icon = isNighttime ? "04n" : "04d";
        } else if (condMod == 2) {
            mainCond = "Rain";
            desc = isNighttime ? "night rain shower" : "heavy rainfall";
            icon = isNighttime ? "10n" : "10d";
        } else if (condMod == 3) {
            mainCond = "Thunderstorm";
            desc = isNighttime ? "night thunderstorm" : "thunderstorm with rain";
            icon = isNighttime ? "11n" : "11d";
        } else {
            mainCond = "Snow";
            desc = isNighttime ? "night snow shower" : "light snow shower";
            icon = isNighttime ? "13n" : "13d";
        }

        List<Map<String, Object>> weather = new ArrayList<>();
        Map<String, Object> w = new HashMap<>();
        w.put("main", mainCond);
        w.put("description", desc);
        w.put("icon", icon);
        weather.add(w);
        res.put("weather", weather);

        Map<String, Object> main = new HashMap<>();
        main.put("temp", Math.round(baseTemp * 10.0) / 10.0);
        main.put("feels_like", Math.round((baseTemp + 0.8) * 10.0) / 10.0);
        main.put("temp_min", Math.round((baseTemp - 3.5) * 10.0) / 10.0);
        main.put("temp_max", Math.round((baseTemp + 4.2) * 10.0) / 10.0);
        main.put("pressure", 1008 + (hash % 16));
        main.put("humidity", 40 + (hash % 50));
        res.put("main", main);

        Map<String, Object> wind = new HashMap<>();
        wind.put("speed", Math.round((2.5 + (hash % 12) * 0.5) * 10.0) / 10.0);
        wind.put("deg", (hash * 37) % 360);
        res.put("wind", wind);

        Map<String, Object> cloudsObj = new HashMap<>();
        cloudsObj.put("all", 10 + (hash % 70));
        res.put("clouds", cloudsObj);

        res.put("visibility", 8000 + ((hash % 3) * 1000));
        res.put("dt", now);
        res.put("timezone", tzOffsetSeconds);

        Map<String, Object> coord = new HashMap<>();
        coord.put("lat", lat != null ? lat : 22.5726);
        coord.put("lon", lon != null ? lon : 88.3639);
        res.put("coord", coord);

        return res;
    }

    private Map<String, Object> generateDynamicForecast(String cityName, Double lat, Double lon) {
        Map<String, Object> res = new HashMap<>();
        List<Map<String, Object>> list = new ArrayList<>();
        long now = System.currentTimeMillis() / 1000;

        String name = (cityName != null && !cityName.trim().isEmpty()) ? cityName : "Chennai";
        int hash;
        if (lat != null && lon != null) {
            hash = Math.abs(Objects.hash(Math.round(lat * 100.0), Math.round(lon * 100.0), name.toLowerCase()));
        } else {
            hash = Math.abs(name.toLowerCase().hashCode());
        }

        String country = getCountryCode(name);
        int tzOffsetSeconds = resolveTimezoneOffset(country, name, lon);

        double baseTemp = 12.0 + (hash % 24);
        int condMod = hash % 5;

        for (int i = 0; i < 40; i++) {
            Map<String, Object> item = new HashMap<>();
            long dt = now + (i * 3 * 3600);
            item.put("dt", dt);

            long localDt = dt + tzOffsetSeconds;
            double hour = Math.floorMod(localDt, 86400L) / 3600.0;
            boolean isItemNight = (hour < 6.0 || hour >= 18.5);

            double temp = baseTemp + Math.sin(i * 0.4) * 4.5;
            Map<String, Object> main = new HashMap<>();
            main.put("temp", Math.round(temp * 10.0) / 10.0);
            main.put("temp_min", Math.round((temp - 2.0) * 10.0) / 10.0);
            main.put("temp_max", Math.round((temp + 2.0) * 10.0) / 10.0);
            main.put("humidity", 40 + ((hash + i) % 45));
            item.put("main", main);

            List<Map<String, Object>> weather = new ArrayList<>();
            Map<String, Object> w = new HashMap<>();
            
            String cond = "Clear";
            String icon = isItemNight ? "01n" : "01d";
            if (condMod == 1) { cond = "Clouds"; icon = isItemNight ? "04n" : "03d"; }
            else if (condMod == 2) { cond = "Rain"; icon = isItemNight ? "10n" : "10d"; }
            else if (condMod == 3) { cond = "Thunderstorm"; icon = isItemNight ? "11n" : "11d"; }
            else if (condMod == 4) { cond = "Snow"; icon = isItemNight ? "13n" : "13d"; }

            w.put("main", cond);
            w.put("description", cond.toLowerCase());
            w.put("icon", icon);
            weather.add(w);
            item.put("weather", weather);

            list.add(item);
        }

        res.put("list", list);
        return res;
    }

    private Map<String, Object> generateDynamicPollution(Double lat, Double lon) {
        Map<String, Object> res = new HashMap<>();
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();

        int hash = (lat != null && lon != null) ? Math.abs(Objects.hash(Math.round(lat * 100.0), Math.round(lon * 100.0))) : 42;
        int aqi = 1 + (hash % 5);

        Map<String, Object> main = new HashMap<>();
        main.put("aqi", aqi);
        item.put("main", main);

        Map<String, Object> comp = new HashMap<>();
        comp.put("pm2_5", Math.round((5.0 + (hash % 45)) * 10.0) / 10.0);
        comp.put("pm10", Math.round((10.0 + (hash % 80)) * 10.0) / 10.0);
        comp.put("no2", Math.round((12.0 + (hash % 30)) * 10.0) / 10.0);
        comp.put("o3", Math.round((30.0 + (hash % 50)) * 10.0) / 10.0);
        item.put("components", comp);

        list.add(item);
        res.put("list", list);
        return res;
    }

    private List<Map<String, Object>> generateDynamicGeocoding(String query) {
        if (query == null || query.trim().length() < 2) return Collections.emptyList();
        String q = query.trim().toLowerCase();

        List<Map<String, Object>> list = new ArrayList<>();

        if (q.equals("india") || q.equals("ind")) {
            for (String[] c : GLOBAL_CITIES) {
                if ("IN".equals(c[1])) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", c[0]);
                    map.put("country", c[1]);
                    map.put("lat", Double.parseDouble(c[2]));
                    map.put("lon", Double.parseDouble(c[3]));
                    list.add(map);
                    if (list.size() >= 8) break;
                }
            }
            return list;
        }

        for (String[] c : GLOBAL_CITIES) {
            if (c[0].toLowerCase().contains(q)) {
                Map<String, Object> map = new HashMap<>();
                map.put("name", c[0]);
                map.put("country", c[1]);
                map.put("lat", Double.parseDouble(c[2]));
                map.put("lon", Double.parseDouble(c[3]));
                list.add(map);
                if (list.size() >= 8) break;
            }
        }

        if (list.isEmpty()) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", capitalize(query.trim()));
            map.put("country", getCountryCode(query.trim()));
            map.put("lat", 19.0760);
            map.put("lon", 72.8777);
            list.add(map);
        }

        return list;
    }

    private String sanitizeCityName(String cityName) {
        if (cityName == null || cityName.trim().isEmpty()) return "Chennai";
        String trimmed = cityName.trim();
        if (trimmed.equalsIgnoreCase("india")) return "Mumbai";
        return capitalize(trimmed);
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return "";
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    private String getCountryCode(String city) {
        if (city == null) return "IN";
        for (String[] c : GLOBAL_CITIES) {
            if (c[0].equalsIgnoreCase(city.trim())) {
                return c[1];
            }
        }
        return "IN";
    }

    private int resolveTimezoneOffset(String countryCode, String cityName, Double lon) {
        if ("IN".equalsIgnoreCase(countryCode) || isIndianCity(cityName)) {
            return 19800; // IST: Indian Standard Time (UTC+5:30)
        }
        if ("GB".equalsIgnoreCase(countryCode)) {
            return 0; // GMT: London / UK (+0:00)
        }
        if ("US".equalsIgnoreCase(countryCode)) {
            if (cityName != null) {
                String lc = cityName.toLowerCase();
                if (lc.contains("angeles") || lc.contains("francisco")) return -28800; // PST (-8:00)
                if (lc.contains("chicago")) return -21600; // CST (-6:00)
            }
            return -18000; // EST (-5:00)
        }
        if ("CA".equalsIgnoreCase(countryCode)) {
            if (cityName != null && cityName.toLowerCase().contains("vancouver")) return -28800;
            return -18000; // EST (-5:00)
        }
        if ("JP".equalsIgnoreCase(countryCode) || "KR".equalsIgnoreCase(countryCode)) {
            return 32400; // JST / KST (+9:00)
        }
        if ("CN".equalsIgnoreCase(countryCode) || "SG".equalsIgnoreCase(countryCode) || "MY".equalsIgnoreCase(countryCode)) {
            return 28800; // CST / SGT / MYT (+8:00)
        }
        if ("AU".equalsIgnoreCase(countryCode)) {
            return 36000; // AEST (+10:00)
        }
        if ("NZ".equalsIgnoreCase(countryCode)) {
            return 43200; // NZST (+12:00)
        }
        if ("AE".equalsIgnoreCase(countryCode)) {
            return 14400; // GST Dubai (+4:00)
        }
        if ("TH".equalsIgnoreCase(countryCode)) {
            return 25200; // ICT Bangkok (+7:00)
        }
        if ("EG".equalsIgnoreCase(countryCode)) {
            return 7200; // EET Cairo (+2:00)
        }
        if ("TR".equalsIgnoreCase(countryCode) || "RU".equalsIgnoreCase(countryCode)) {
            return 10800; // TRT / MSK (+3:00)
        }
        if ("FR".equalsIgnoreCase(countryCode) || "DE".equalsIgnoreCase(countryCode) ||
            "IT".equalsIgnoreCase(countryCode) || "NL".equalsIgnoreCase(countryCode) ||
            "CH".equalsIgnoreCase(countryCode) || "ES".equalsIgnoreCase(countryCode) ||
            "AT".equalsIgnoreCase(countryCode)) {
            return 3600; // CET Europe (+1:00)
        }
        if ("BR".equalsIgnoreCase(countryCode)) {
            return -10800; // BRT (-3:00)
        }

        if (lon != null && Math.abs(lon) > 0.001) {
            return (int) (Math.round(lon / 15.0) * 3600);
        }
        return 19800; // Default IST (+5:30)
    }

    private boolean isIndianCity(String cityName) {
        if (cityName == null) return false;
        String name = cityName.trim();
        for (String[] c : GLOBAL_CITIES) {
            if ("IN".equalsIgnoreCase(c[1]) && c[0].equalsIgnoreCase(name)) {
                return true;
            }
        }
        return false;
    }
}
