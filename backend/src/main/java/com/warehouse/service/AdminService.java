package com.warehouse.service;

import com.warehouse.dto.response.DashboardStats;
import com.warehouse.dto.response.UserResponse;
import com.warehouse.entity.User;
import com.warehouse.entity.enums.OrderStatus;
import com.warehouse.entity.enums.OrderType;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public DashboardStats getSystemStats() {
        return DashboardStats.builder()
                .totalProducts(productRepository.count())
                .totalCategories(categoryRepository.count())
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .completedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED))
                .totalUsers(userRepository.count())
                .inboundOrders(orderRepository.countByOrderType(OrderType.INBOUND))
                .outboundOrders(orderRepository.countByOrderType(OrderType.OUTBOUND))
                .lowStockItems(inventoryRepository.findByQuantityLessThan(10).size())
                .build();
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToUserResponse(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }

    private UserResponse mapToUserResponse(User user) {
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toList());

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
