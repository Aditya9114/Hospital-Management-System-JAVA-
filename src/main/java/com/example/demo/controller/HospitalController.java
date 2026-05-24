package com.example.demo.controller;

import com.example.demo.model.Patient;
import com.example.demo.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospital")
@CrossOrigin(origins = {"http://localhost:5173", "https://hospital-management-system-three-ochre.vercel.app/"})

public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @GetMapping("/{type}/beds")
    public ResponseEntity<?> getBedCount(@PathVariable String type) {
        int count = hospitalService.getBedCount(type);
        if (count == -1) return ResponseEntity.badRequest().body("Room not found");
        return ResponseEntity.ok(Map.of("beds", count));
    }

    @PutMapping("/{type}/beds")
    public ResponseEntity<?> editBedCount(@PathVariable String type,
                                          @RequestBody Map<String, Integer> body) {
        String result = hospitalService.editBedCount(type, body.get("beds"));
        return ResponseEntity.ok(Map.of("message", result));
    }

    @GetMapping("/{type}/empty-bed")
    public ResponseEntity<?> findEmptyBed(@PathVariable String type) {
        int index = hospitalService.findEmptyBed(type);
        if (index == -1) return ResponseEntity.ok(Map.of("message", "No Empty Bed Available"));
        return ResponseEntity.ok(Map.of("emptyBedIndex", index));
    }

    @PostMapping("/{type}/assign")
    public ResponseEntity<?> assignPatient(@PathVariable String type,
                                           @RequestBody Patient patient) {
        String result = hospitalService.assignPatient(type, patient);
        return ResponseEntity.ok(Map.of("message", result));
    }

    @GetMapping("/{type}/patients")
    public ResponseEntity<List<Patient>> getPatients(@PathVariable String type) {
        return ResponseEntity.ok(hospitalService.getPatients(type));
    }

    @DeleteMapping("/{type}/discharge/{id}")
    public ResponseEntity<?> dischargePatient(@PathVariable String type, @PathVariable String id) {
        String result = hospitalService.removePatient(id);
        return ResponseEntity.ok(Map.of("message", result));
    }
}