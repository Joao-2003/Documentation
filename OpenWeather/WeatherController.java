package com.fazenda.api.controller;

import com.fazenda.api.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/weather")
@CrossOrigin(origins = "*") // Ajuste conforme necessário para o seu front-end
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/pluviometry")
    public ResponseEntity<?> getPluviometry(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        if (startDate.isAfter(endDate)) {
            return ResponseEntity.badRequest().body("A data de plantio deve ser anterior à colheita.");
        }

        Map<String, Object> result = weatherService.calculatePluviometry(lat, lon, startDate, endDate);
        return ResponseEntity.ok(result);
    }
}
