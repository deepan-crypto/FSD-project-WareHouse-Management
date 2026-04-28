package com.warehouse.service;

import com.warehouse.dto.request.OrderItemRequest;
import com.warehouse.dto.request.OrderRequest;
import com.warehouse.dto.response.OrderItemResponse;
import com.warehouse.dto.response.OrderResponse;
import com.warehouse.entity.*;
import com.warehouse.entity.enums.MovementType;
import com.warehouse.entity.enums.OrderStatus;
import com.warehouse.entity.enums.OrderType;
import com.warehouse.exception.BadRequestException;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return mapToResponse(order);
    }

    public List<OrderResponse> getOrdersByCurrentUser() {
        User currentUser = getCurrentUser();
        return orderRepository.findByUserId(currentUser.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User currentUser = getCurrentUser();

        // Parse order type
        OrderType orderType;
        try {
            orderType = OrderType.valueOf(request.getOrderType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order type. Must be INBOUND or OUTBOUND");
        }

        // Create order
        Order order = Order.builder()
                .user(currentUser)
                .orderType(orderType)
                .status(OrderStatus.PENDING)
                .build();

        // Process order items
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemRequest.getProductId()));

            // For OUTBOUND orders, validate stock availability
            if (orderType == OrderType.OUTBOUND) {
                Inventory inventory = inventoryRepository.findByProductId(product.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Inventory", "productId", product.getId()));

                if (inventory.getQuantity() < itemRequest.getQuantity()) {
                    throw new BadRequestException(
                        "Insufficient stock for product '" + product.getName() +
                        "'. Available: " + inventory.getQuantity() +
                        ", Requested: " + itemRequest.getQuantity()
                    );
                }
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .build();

            order.addOrderItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // Update inventory and create stock movements
        processInventoryForOrder(savedOrder);

        return mapToResponse(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status. Must be PENDING, PROCESSING, COMPLETED, or CANCELLED");
        }

        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    private void processInventoryForOrder(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            Inventory inventory = inventoryRepository.findByProductId(item.getProduct().getId())
                    .orElse(Inventory.builder()
                            .product(item.getProduct())
                            .quantity(0)
                            .location("UNASSIGNED")
                            .build());

            MovementType movementType;
            if (order.getOrderType() == OrderType.INBOUND) {
                inventory.setQuantity(inventory.getQuantity() + item.getQuantity());
                movementType = MovementType.IN;
            } else {
                inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
                movementType = MovementType.OUT;
            }

            inventoryRepository.save(inventory);

            // Record stock movement
            StockMovement movement = StockMovement.builder()
                    .product(item.getProduct())
                    .quantity(item.getQuantity())
                    .movementType(movementType)
                    .remarks("Order #" + order.getId() + " - " + order.getOrderType())
                    .build();
            stockMovementRepository.save(movement);
        }
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new BadRequestException("Current user not found"));
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .orderType(order.getOrderType().name())
                .status(order.getStatus().name())
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
