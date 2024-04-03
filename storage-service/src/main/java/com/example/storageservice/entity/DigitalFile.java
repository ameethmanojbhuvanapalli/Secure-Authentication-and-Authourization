package com.example.storageservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="FileData")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DigitalFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(unique = true)
    String filename;
    String filepath;
    String role;
}
