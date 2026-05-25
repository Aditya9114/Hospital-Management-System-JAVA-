package com.example.demo.repository;

import com.example.demo.model.DischargeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DischargeRecordRepository extends JpaRepository<DischargeRecord, Long> {
    List<DischargeRecord> findByPatientId(String patientId);
}
