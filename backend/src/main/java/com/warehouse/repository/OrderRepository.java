package com.warehouse.repository;

import com.warehouse.entity.Order;
import com.warehouse.entity.enums.OrderStatus;
import com.warehouse.entity.enums.OrderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByOrderType(OrderType orderType);
    List<Order> findByStatus(OrderStatus status);
    long countByStatus(OrderStatus status);
    long countByOrderType(OrderType orderType);
}
