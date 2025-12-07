package com.crypto.repository;

import com.crypto.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatus(String status);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = 'pending'")
    Long countPendingReports();
}
