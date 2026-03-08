package com.fazenda.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://api.openweathermap.org/data/3.0/onecall/timemachine";
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> calculatePluviometry(double lat, double lon, LocalDate start, LocalDate end) {
        double totalRain = 0.0;
        int daysWithData = 0;
        List<Map<String, Object>> dailyDetails = new ArrayList<>();

        // Itera sobre cada dia do período da safra
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            long unixTimestamp = date.atStartOfDay(ZoneOffset.UTC).toEpochSecond();
            
            String url = String.format("%s?lat=%f&lon=%f&dt=%d&appid=%s&units=metric", 
                                        BASE_URL, lat, lon, unixTimestamp, apiKey);
            
            try {
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                if (response != null && response.containsKey("data")) {
                    List<Map<String, Object>> dataList = (List<Map<String, Object>>) response.get("data");
                    
                    // O Timemachine retorna dados horários para o timestamp solicitado
                    double dailySum = 0.0;
                    for (Map<String, Object> hourData : dataList) {
                        if (hourData.containsKey("rain")) {
                            Map<String, Double> rainMap = (Map<String, Double>) hourData.get("rain");
                            // Pega o volume de chuva na última hora ("1h")
                            dailySum += rainMap.getOrDefault("1h", 0.0);
                        }
                    }
                    
                    totalRain += dailySum;
                    daysWithData++;
                    
                    dailyDetails.add(Map.of(
                        "date", date.toString(),
                        "rain", dailySum
                    ));
                }
            } catch (Exception e) {
                // Log error or handle API limits
                System.err.println("Erro ao buscar dados para o dia " + date + ": " + e.getMessage());
            }
        }

        double averageRain = daysWithData > 0 ? totalRain / daysWithData : 0.0;

        return Map.of(
            "totalAccumulated", totalRain,
            "dailyAverage", averageRain,
            "periodDays", daysWithData,
            "history", dailyDetails
        );
    }
}
