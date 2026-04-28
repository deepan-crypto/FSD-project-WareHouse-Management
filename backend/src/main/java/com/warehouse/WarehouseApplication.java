package com.warehouse;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Warehouse Management System API",
        version = "1.0.0",
        description = "Production-ready REST API for Warehouse Management System with JWT authentication, role-based access control, inventory tracking, and order management.",
        contact = @Contact(name = "WMS Support", email = "support@warehouse.com"),
        license = @License(name = "MIT License", url = "https://opensource.org/licenses/MIT")
    )
)
public class WarehouseApplication {

    public static void main(String[] args) {
        SpringApplication.run(WarehouseApplication.class, args);
    }
}
