package com.warehouse.config;

import com.warehouse.entity.*;
import com.warehouse.entity.enums.MovementType;
import com.warehouse.entity.enums.OrderStatus;
import com.warehouse.entity.enums.OrderType;
import com.warehouse.entity.enums.RoleName;
import com.warehouse.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Only seed if roles don't exist (first run)
        if (roleRepository.count() == 0) {
            logger.info("🌱 Seeding database with initial data...");
            seedRoles();
            seedUsers();
            seedCategoriesAndProducts();
            seedInventory();
            seedOrders();
            logger.info("✅ Database seeding completed successfully!");
        } else {
            logger.info("📦 Database already seeded. Skipping...");
        }
    }

    private void seedRoles() {
        Role adminRole = Role.builder().roleName(RoleName.ROLE_ADMIN).build();
        Role staffRole = Role.builder().roleName(RoleName.ROLE_STAFF).build();
        roleRepository.saveAll(Arrays.asList(adminRole, staffRole));
        logger.info("  ✓ Roles seeded: ROLE_ADMIN, ROLE_STAFF");
    }

    private void seedUsers() {
        Role adminRole = roleRepository.findByRoleName(RoleName.ROLE_ADMIN).get();
        Role staffRole = roleRepository.findByRoleName(RoleName.ROLE_STAFF).get();

        // Admin user
        User admin = User.builder()
                .name("Admin User")
                .email("admin@warehouse.com")
                .password(passwordEncoder.encode("admin123"))
                .roles(new HashSet<>(Set.of(adminRole)))
                .build();

        // Staff users
        User staff1 = User.builder()
                .name("John Staff")
                .email("john@warehouse.com")
                .password(passwordEncoder.encode("staff123"))
                .roles(new HashSet<>(Set.of(staffRole)))
                .build();

        User staff2 = User.builder()
                .name("Jane Staff")
                .email("jane@warehouse.com")
                .password(passwordEncoder.encode("staff123"))
                .roles(new HashSet<>(Set.of(staffRole)))
                .build();

        userRepository.saveAll(Arrays.asList(admin, staff1, staff2));
        logger.info("  ✓ Users seeded: admin@warehouse.com (ADMIN), john@warehouse.com (STAFF), jane@warehouse.com (STAFF)");
    }

    private void seedCategoriesAndProducts() {
        // Categories
        Category electronics = categoryRepository.save(Category.builder().name("Electronics").build());
        Category furniture = categoryRepository.save(Category.builder().name("Furniture").build());
        Category clothing = categoryRepository.save(Category.builder().name("Clothing").build());
        Category food = categoryRepository.save(Category.builder().name("Food & Beverages").build());
        Category tools = categoryRepository.save(Category.builder().name("Tools & Hardware").build());

        // Products
        List<Product> products = Arrays.asList(
            Product.builder().name("Laptop Dell XPS 15").description("High-performance laptop with 16GB RAM").price(new BigDecimal("1299.99")).category(electronics).build(),
            Product.builder().name("Wireless Mouse").description("Ergonomic wireless mouse").price(new BigDecimal("29.99")).category(electronics).build(),
            Product.builder().name("USB-C Hub").description("7-in-1 USB-C docking station").price(new BigDecimal("49.99")).category(electronics).build(),
            Product.builder().name("Monitor 27\"").description("4K IPS display monitor").price(new BigDecimal("449.99")).category(electronics).build(),
            Product.builder().name("Office Desk").description("Adjustable standing desk").price(new BigDecimal("599.99")).category(furniture).build(),
            Product.builder().name("Ergonomic Chair").description("Mesh back office chair with lumbar support").price(new BigDecimal("349.99")).category(furniture).build(),
            Product.builder().name("Filing Cabinet").description("4-drawer steel filing cabinet").price(new BigDecimal("189.99")).category(furniture).build(),
            Product.builder().name("Safety Vest").description("High-visibility safety vest").price(new BigDecimal("15.99")).category(clothing).build(),
            Product.builder().name("Work Boots").description("Steel toe safety boots").price(new BigDecimal("89.99")).category(clothing).build(),
            Product.builder().name("Bottled Water (24pk)").description("Spring water 500ml bottles").price(new BigDecimal("8.99")).category(food).build(),
            Product.builder().name("Power Drill").description("Cordless 20V power drill").price(new BigDecimal("129.99")).category(tools).build(),
            Product.builder().name("Wrench Set").description("12-piece combination wrench set").price(new BigDecimal("34.99")).category(tools).build()
        );

        productRepository.saveAll(products);
        logger.info("  ✓ Categories seeded: {} categories", 5);
        logger.info("  ✓ Products seeded: {} products", products.size());
    }

    private void seedInventory() {
        List<Product> products = productRepository.findAll();
        int[] quantities = {50, 200, 150, 30, 20, 15, 25, 500, 100, 1000, 45, 80};
        String[] locations = {"A1-01", "A1-02", "A2-01", "A2-02", "B1-01", "B1-02", "B2-01", "C1-01", "C1-02", "D1-01", "E1-01", "E1-02"};

        for (int i = 0; i < products.size(); i++) {
            Inventory inventory = Inventory.builder()
                    .product(products.get(i))
                    .quantity(quantities[i % quantities.length])
                    .location(locations[i % locations.length])
                    .build();
            inventoryRepository.save(inventory);

            // Create initial stock movement
            StockMovement movement = StockMovement.builder()
                    .product(products.get(i))
                    .quantity(quantities[i % quantities.length])
                    .movementType(MovementType.IN)
                    .remarks("Initial stock seeding")
                    .build();
            stockMovementRepository.save(movement);
        }

        logger.info("  ✓ Inventory seeded for {} products", products.size());
    }

    private void seedOrders() {
        User staff = userRepository.findByEmail("john@warehouse.com").get();
        List<Product> products = productRepository.findAll();

        // Inbound order
        Order inboundOrder = Order.builder()
                .user(staff)
                .orderType(OrderType.INBOUND)
                .status(OrderStatus.COMPLETED)
                .build();

        OrderItem inItem1 = OrderItem.builder().product(products.get(0)).quantity(10).build();
        OrderItem inItem2 = OrderItem.builder().product(products.get(1)).quantity(50).build();
        inboundOrder.addOrderItem(inItem1);
        inboundOrder.addOrderItem(inItem2);
        orderRepository.save(inboundOrder);

        // Outbound order
        Order outboundOrder = Order.builder()
                .user(staff)
                .orderType(OrderType.OUTBOUND)
                .status(OrderStatus.PENDING)
                .build();

        OrderItem outItem1 = OrderItem.builder().product(products.get(3)).quantity(5).build();
        OrderItem outItem2 = OrderItem.builder().product(products.get(7)).quantity(20).build();
        outboundOrder.addOrderItem(outItem1);
        outboundOrder.addOrderItem(outItem2);
        orderRepository.save(outboundOrder);

        logger.info("  ✓ Sample orders seeded: 1 INBOUND (COMPLETED), 1 OUTBOUND (PENDING)");
    }
}
