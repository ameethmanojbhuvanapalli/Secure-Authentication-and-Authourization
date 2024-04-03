package com.example.apigateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.ArrayList;

@RestController
public class GatewayController {

    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping("/instances")
    public List<ServiceInstance> getInstances() {
        // Get all service IDs registered with the discovery client
        List<String> services = discoveryClient.getServices();
        List<ServiceInstance> allInstances = new ArrayList<>();

        // Loop through all services to get instances for each service
        for (String serviceId : services) {
            List<ServiceInstance> instances = discoveryClient.getInstances(serviceId);
            allInstances.addAll(instances);
        }

        return allInstances;
    }
}
