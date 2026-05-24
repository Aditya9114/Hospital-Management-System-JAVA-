package com.example.demo.model;

import lombok.Data;
import java.util.ArrayList;

@Data
public class Room {
    private String roomNo;
    private int beds;
    private String type;
    private ArrayList<Patient> patients = new ArrayList<>();

    public Room(int beds, String roomNo, String type) {
        this.beds = beds;
        this.roomNo = roomNo;
        this.type = type;
        for (int i = 0; i < beds; i++) {
            patients.add(new Patient());
        }
    }

    public int findEmptyBed() {
        for (int i = 0; i < patients.size(); i++) {
            if (patients.get(i).getPatientId().equals("-1")) {
                return i;
            }
        }
        return -1;
    }

    public String assignBed(Patient p) {
        int index = findEmptyBed();
        if (index >= 0) {
            patients.set(index, p);
            return "Patient assigned to bed " + index;
        }
        return "No Empty Bed Available";
    }

    public void editBedCount(int newBedCount) {
        if (newBedCount > beds) {
            for (int i = beds; i < newBedCount; i++) {
                patients.add(new Patient());
            }
        } else if (newBedCount < beds) {
            while (patients.size() > newBedCount) {
                patients.remove(patients.size() - 1);
            }
        }
        beds = newBedCount;
    }
}