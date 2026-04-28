package com.warehouse.repository;

import com.warehouse.entity.StockMovement;
import com.warehouse.entity.enums.MovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductId(Long productId);
    List<StockMovement> findByMovementType(MovementType movementType);
    List<StockMovement> findTop20ByOrderByTimestampDesc();
}
