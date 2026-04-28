package com.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalProducts;
    private long totalCategories;
    private long totalOrders;
    private long pendingOrders;
    private long completedOrders;
    private long totalUsers;
    private long inboundOrders;
    private long outboundOrders;
    private long lowStockItems;
}
