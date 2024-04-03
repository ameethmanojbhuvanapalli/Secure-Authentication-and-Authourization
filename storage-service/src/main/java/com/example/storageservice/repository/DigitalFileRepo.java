package com.example.storageservice.repository;

import com.example.storageservice.entity.DigitalFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DigitalFileRepo extends JpaRepository<DigitalFile, Long> {
    DigitalFile findByFilename(String filename);

    List<DigitalFile> findByRole(String role);
}
