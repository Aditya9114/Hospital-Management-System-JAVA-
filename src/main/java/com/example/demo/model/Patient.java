package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "patients")
public class Patient {

    @Id
    private String patientId;
    private String patientName;
    private int age;
    private String disease;
    private String roomType;
    private Long doctorId;
    private String admittedDate;

    public Patient() {
        this.patientId = "-1";
    }

    public Patient(String patientId, String patientName, int age, String disease) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.age = age;
        this.disease = disease;
    }
}