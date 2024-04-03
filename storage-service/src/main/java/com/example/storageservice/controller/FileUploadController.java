package com.example.storageservice.controller;

import com.example.storageservice.entity.DigitalFile;
import com.example.storageservice.repository.DigitalFileRepo;
import com.example.storageservice.service.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/file")
public class FileUploadController {

    private static final String UPLOAD_PATH = "D:\\Mini Project 2\\files\\";

    @Autowired
    private DigitalFileRepo digitalFileRepo;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/upload")
    public ResponseEntity<?> handleFileUpload(@CookieValue(value = "token", defaultValue = "defaultToken") String token,@RequestParam("file") MultipartFile file, @RequestParam("filename") String fileName, @RequestParam("role") String role) {
        System.out.println(token);
        Claims claims = jwtService.decodeJwt(token);
        // Extract necessary information from claims
        String userrole = claims.get("role", String.class);
        System.out.println(userrole);
        if(!userrole.equalsIgnoreCase("admin_roles")){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Permission denied.");
        }
        try {
            byte[] bytes = file.getBytes();

            // Determine file path based on the role
            String basePath = (role.equalsIgnoreCase("admin_roles")) ? "Admin\\" : "User\\";
            Path directoryPath = Paths.get(UPLOAD_PATH + basePath);

            // Create directory if it doesn't exist
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }

            Path filePath = directoryPath.resolve(fileName);
            Files.write(filePath, bytes);

            DigitalFile digitalFile = new DigitalFile();
            digitalFile.setFilename(fileName);
            digitalFile.setFilepath(filePath.toString());
            digitalFile.setRole(role);
            digitalFileRepo.save(digitalFile);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok("File uploaded successfully.");
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteFile(@CookieValue(value = "token", defaultValue = "defaultToken") String token,@RequestParam("filename") String filename) {
        Claims claims = jwtService.decodeJwt(token);

        // Extract necessary information from claims
        String role = claims.get("role", String.class);

        if (role.equalsIgnoreCase("admin_roles")) {
            // Perform delete operation
            try {
                DigitalFile digitalFile = digitalFileRepo.findByFilename(filename);
                String path = digitalFile.getFilepath();
                Path filePath = Paths.get(path);
                Files.deleteIfExists(filePath);

                // Delete from the database
                digitalFileRepo.delete(digitalFile);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            return ResponseEntity.ok("File deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Permission denied.");
        }
    }
    
    @GetMapping("/list")
    public ResponseEntity<List<DigitalFile>> getAllFiles(@CookieValue(value = "token",defaultValue = "defaultToken") String token) {
        List<DigitalFile> files;
        Claims claims = jwtService.decodeJwt(token);

        // Extract necessary information from claims
        String role = claims.get("role", String.class);

        if (role.equalsIgnoreCase("admin_roles")){
            role=null;
        }
        if (role != null && !role.isEmpty()) {
            files = digitalFileRepo.findByRole(role);
        } else {
            files = digitalFileRepo.findAll();
        }
        return ResponseEntity.ok(files);
    }

}
