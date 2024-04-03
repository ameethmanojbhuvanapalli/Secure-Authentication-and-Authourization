package com.nmam.mfa.model;

//import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

//import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    @Column(unique = true)
    String email;
    String password;
    String roles;
    private  boolean mfaEnabled;
    private String secret;
    private int mfaoption;
    private int emailotp;
    private int isUserActive;

   // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern="yyyy-MM-dd hh:mm:ss")
   // @Column(name = "otp_gen_time")
   // private Date otp_gen_time;

  //  @CreationTimestamp
   // @Column(name="timestamp", nullable = false, updatable = false, insertable = false)
   // private Timestamp timestamp;
}


/*
*
*
* */