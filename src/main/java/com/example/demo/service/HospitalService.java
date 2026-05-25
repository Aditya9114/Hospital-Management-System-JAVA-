package com.example.demo.service;

import com.example.demo.model.DischargeRecord;
import com.example.demo.model.Patient;
import com.example.demo.repository.DischargeRecordRepository;
import com.example.demo.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class HospitalService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DischargeRecordRepository dischargeRecordRepository;

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
        patient.setAdmittedDate(LocalDate.now().toString());
        patientRepository.save(patient);
        return "Patient assigned successfully";
    }

    public List<Patient> getPatients(String type) {
        return patientRepository.findByRoomType(type);
    }

    public String removePatient(String patientId) {
        if (patientRepository.existsById(patientId)) {
            Patient patient = patientRepository.findById(patientId).get();

            // Calculate bill
            String admittedStr = patient.getAdmittedDate();
            LocalDate admittedDate = (admittedStr != null) ? LocalDate.parse(admittedStr) : LocalDate.now();
            LocalDate dischargedDate = LocalDate.now();
            int totalDays = (int) ChronoUnit.DAYS.between(admittedDate, dischargedDate);
            if (totalDays < 1) totalDays = 1;

            double ratePerDay = getRatePerDay(patient.getRoomType());
            double billAmount = ratePerDay * totalDays;

            // Save discharge record
            DischargeRecord record = new DischargeRecord();
            record.setPatientId(patient.getPatientId());
            record.setPatientName(patient.getPatientName());
            record.setRoomType(patient.getRoomType());
            record.setAdmittedDate(admittedDate.toString());
            record.setDischargedDate(dischargedDate.toString());
            record.setTotalDays(totalDays);
            record.setBillAmount(billAmount);
            dischargeRecordRepository.save(record);

            patientRepository.deleteById(patientId);
            return "Patient discharged successfully";
        }
        return "Patient not found";
    }

    private double getRatePerDay(String roomType) {
        if (roomType == null) return 1000;
        if (roomType.equalsIgnoreCase("emergency")) return 5000;
        if (roomType.equalsIgnoreCase("general")) return 2000;
        if (roomType.equalsIgnoreCase("general2")) return 1000;
        return 1000;
    }

    public List<DischargeRecord> getDischargeHistory() {
        return dischargeRecordRepository.findAll();
    }

    public List<DischargeRecord> getBill(String patientId) {
        return dischargeRecordRepository.findByPatientId(patientId);
    }
}