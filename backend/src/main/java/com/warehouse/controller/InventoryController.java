package com.warehouse.controller;

import com.warehouse.dto.request.InventoryUpdateRequest;
import com.warehouse.dto.response.InventoryResponse;
import com.warehouse.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "Inventory management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "Get all inventory items", description = "Returns inventory for all products")
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{productId}")
    @Operation(summary = "Get inventory by product ID")
    public ResponseEntity<InventoryResponse> getInventoryByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getInventoryByProductId(productId));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get low stock items", description = "Returns items below threshold (default: 10)")
    public ResponseEntity<List<InventoryResponse>> getLowStockItems(
            @RequestParam(defaultValue = "10") Integer threshold) {
        return ResponseEntity.ok(inventoryService.getLowStockItems(threshold));
    }

    @PutMapping("/{productId}")
    @Operation(summary = "Update inventory", description = "Admin only - updates quantity and location for a product")
    public ResponseEntity<InventoryResponse> updateInventory(@PathVariable Long productId,
                                                              @Valid @RequestBody InventoryUpdateRequest request) {
        return ResponseEntity.ok(inventoryService.updateInventory(productId, request));
    }
}
