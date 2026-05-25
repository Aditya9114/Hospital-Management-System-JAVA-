package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "discharge_records")
public class DischargeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String patientId;
    private String patientName;
    private String roomType;
    private String admittedDate;
    private String dischargedDate;
    private int totalDays;
    private double billAmount;
}
