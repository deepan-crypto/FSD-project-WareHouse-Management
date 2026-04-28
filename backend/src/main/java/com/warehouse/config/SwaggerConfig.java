package com.warehouse.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "Enter your JWT token in the format: Bearer {token}"
)
public class SwaggerConfig {
    // OpenAPI/Swagger configuration is handled via annotations
    // Swagger UI available at: /swagger-ui.html
    // API docs available at: /api-docs
}
