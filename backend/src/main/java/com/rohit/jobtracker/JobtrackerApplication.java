package com.rohit.jobtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JobtrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobtrackerApplication.class, args);
        System.out.println("Backend server is running...");
    }
}
