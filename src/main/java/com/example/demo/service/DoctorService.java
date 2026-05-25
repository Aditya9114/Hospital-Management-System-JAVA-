package com.example.demo.service;

import com.example.demo.model.Doctor;
import com.example.demo.model.Patient;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public String assignDoctorToPatient(String patientId, Long doctorId) {
        if (!patientRepository.existsById(patientId)) return "Patient not found";
        if (!doctorRepository.existsById(doctorId)) return "Doctor not found";
        Patient patient = patientRepository.findById(patientId).get();
        patient.setDoctorId(doctorId);
        patientRepository.save(patient);
        return "Doctor assigned to patient successfully";
    }
}
