package com.example.demo.service;

import com.example.demo.model.Patient;
import com.example.demo.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HospitalService {

    @Autowired
    private PatientRepository patientRepository;

    private int emergencyBeds = 2;
    private int generalBeds = 5;
    private int general2Beds = 10;

    public int getBedCount(String type) {
        if (type.equalsIgnoreCase("emergency")) return emergencyBeds;
        if (type.equalsIgnoreCase("general")) return generalBeds;
        if (type.equalsIgnoreCase("general2")) return general2Beds;
        return -1;
    }

    public String editBedCount(String type, int newCount) {
        if (type.equalsIgnoreCase("emergency")) emergencyBeds = newCount;
        else if (type.equalsIgnoreCase("general")) generalBeds = newCount;
        else if(type.equalsIgnoreCase("general2")) general2Beds = newCount;
        else return "Room not found";
        return "Bed count updated to " + newCount;
    }

    public int findEmptyBed(String type) {
        int occupied = patientRepository.findByRoomType(type).size();
        int total = getBedCount(type);
        return occupied < total ? occupied : -1;
    }

    public String assignPatient(String type, Patient patient) {
        int occupied = patientRepository.findByRoomType(type).size();
        int total = getBedCount(type);
        if (occupied >= total) return "No Empty Bed Available";
        patient.setRoomType(type);
        patientRepository.save(patient);
        return "Patient assigned successfully";
    }

    public List<Patient> getPatients(String type) {
        return patientRepository.findByRoomType(type);
    }

    public String removePatient(String patientId) {
        if (patientRepository.existsById(patientId)) {
            patientRepository.deleteById(patientId);
            return "Patient discharged successfully";
        }
        return "Patient not found";
    }
}