package com.warehouse.service;

import com.warehouse.dto.request.InventoryUpdateRequest;
import com.warehouse.dto.response.InventoryResponse;
import com.warehouse.entity.Inventory;
import com.warehouse.entity.StockMovement;
import com.warehouse.entity.enums.MovementType;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.InventoryRepository;
import com.warehouse.repository.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public InventoryResponse getInventoryByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "productId", productId));
        return mapToResponse(inventory);
    }

    public List<InventoryResponse> getLowStockItems(Integer threshold) {
        return inventoryRepository.findByQuantityLessThan(threshold).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InventoryResponse updateInventory(Long productId, InventoryUpdateRequest request) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "productId", productId));

        int oldQuantity = inventory.getQuantity();
        int newQuantity = request.getQuantity();
        int diff = newQuantity - oldQuantity;

        // Update inventory
        inventory.setQuantity(newQuantity);
        inventory.setLocation(request.getLocation());
        Inventory updated = inventoryRepository.save(inventory);

        // Record stock movement
        if (diff != 0) {
            StockMovement movement = StockMovement.builder()
                    .product(inventory.getProduct())
                    .quantity(Math.abs(diff))
                    .movementType(diff > 0 ? MovementType.IN : MovementType.OUT)
                    .remarks("Manual inventory update. Changed from " + oldQuantity + " to " + newQuantity)
                    .build();
            stockMovementRepository.save(movement);
        }

        return mapToResponse(updated);
    }

    private InventoryResponse mapToResponse(Inventory inventory) {
        return InventoryResponse.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct().getId())
                .productName(inventory.getProduct().getName())
                .quantity(inventory.getQuantity())
                .location(inventory.getLocation())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }
}
