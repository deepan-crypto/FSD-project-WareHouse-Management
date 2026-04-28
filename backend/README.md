# Warehouse Management System - Backend

## 🏗️ Tech Stack
- **Backend:** Spring Boot 3.2.5 (Java 17)
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA (Hibernate)
- **Authentication:** JWT (JSON Web Tokens)
- **Build Tool:** Maven
- **API Docs:** Swagger/OpenAPI 3.0

---

## 📁 Project Structure

```
src/main/java/com/warehouse/
├── WarehouseApplication.java          # Main entry point
├── config/
│   ├── CorsConfig.java               # CORS configuration
│   ├── DataSeeder.java               # Sample data seeding
│   └── SwaggerConfig.java            # OpenAPI documentation
├── controller/
│   ├── AdminController.java          # Admin management APIs
│   ├── AuthController.java           # Login & registration
│   ├── InventoryController.java      # Inventory management
│   ├── OrderController.java          # Order management
│   └── ProductController.java        # Product CRUD
├── dto/
│   ├── request/
│   │   ├── InventoryUpdateRequest.java
│   │   ├── LoginRequest.java
│   │   ├── OrderItemRequest.java
│   │   ├── OrderRequest.java
│   │   ├── ProductRequest.java
│   │   └── RegisterRequest.java
│   └── response/
│       ├── DashboardStats.java
│       ├── InventoryResponse.java
│       ├── JwtResponse.java
│       ├── MessageResponse.java
│       ├── OrderItemResponse.java
│       ├── OrderResponse.java
│       ├── ProductResponse.java
│       └── UserResponse.java
├── entity/
│   ├── Category.java
│   ├── Inventory.java
│   ├── Order.java
│   ├── OrderItem.java
│   ├── Product.java
│   ├── Role.java
│   ├── StockMovement.java
│   ├── User.java
│   └── enums/
│       ├── MovementType.java
│       ├── OrderStatus.java
│       ├── OrderType.java
│       └── RoleName.java
├── exception/
│   ├── BadRequestException.java
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
├── repository/
│   ├── CategoryRepository.java
│   ├── InventoryRepository.java
│   ├── OrderItemRepository.java
│   ├── OrderRepository.java
│   ├── ProductRepository.java
│   ├── RoleRepository.java
│   ├── StockMovementRepository.java
│   └── UserRepository.java
├── security/
│   ├── CustomUserDetailsService.java
│   ├── JwtAuthEntryPoint.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   └── SecurityConfig.java
└── service/
    ├── AdminService.java
    ├── AuthService.java
    ├── InventoryService.java
    ├── OrderService.java
    └── ProductService.java
```

---

## 🚀 Local Development Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

### 1. Create PostgreSQL Database
```sql
CREATE DATABASE warehouse_db;
```

### 2. Set Environment Variables
```bash
export DB_URL=jdbc:postgresql://localhost:5432/warehouse_db
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export JWT_SECRET=your-secret-key-at-least-32-characters-long
```

### 3. Build and Run
```bash
cd frontend/backend
mvn clean install
mvn spring-boot:run
```

### 4. Access the API
- **API Base URL:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Docs:** http://localhost:8080/api-docs

---

## 🔐 Default Credentials (Seeded Data)

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| ADMIN | admin@warehouse.com    | admin123   |
| STAFF | john@warehouse.com     | staff123   |
| STAFF | jane@warehouse.com     | staff123   |

---

## 📡 API Endpoints

### Authentication (Public)
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/api/auth/register`  | Register new user    |
| POST   | `/api/auth/login`     | Login & get JWT      |

### Products (Authenticated)
| Method | Endpoint                           | Access | Description          |
|--------|------------------------------------|--------|----------------------|
| GET    | `/api/products`                    | ALL    | List all products    |
| GET    | `/api/products/{id}`               | ALL    | Get product by ID    |
| GET    | `/api/products/search?query=...`   | ALL    | Search products      |
| GET    | `/api/products/category/{catId}`   | ALL    | Filter by category   |
| POST   | `/api/products`                    | ADMIN  | Create product       |
| PUT    | `/api/products/{id}`               | ADMIN  | Update product       |
| DELETE | `/api/products/{id}`               | ADMIN  | Delete product       |

### Inventory (Authenticated)
| Method | Endpoint                                  | Access | Description            |
|--------|-------------------------------------------|--------|------------------------|
| GET    | `/api/inventory`                          | ALL    | List all inventory     |
| GET    | `/api/inventory/{productId}`              | ALL    | Get by product         |
| GET    | `/api/inventory/low-stock?threshold=10`   | ALL    | Low stock items        |
| PUT    | `/api/inventory/{productId}`              | ADMIN  | Update inventory       |

### Orders (Authenticated)
| Method | Endpoint                            | Access | Description            |
|--------|-------------------------------------|--------|------------------------|
| GET    | `/api/orders`                       | ADMIN  | List all orders        |
| GET    | `/api/orders/my-orders`             | ALL    | Current user's orders  |
| GET    | `/api/orders/{id}`                  | ALL    | Get order by ID        |
| POST   | `/api/orders`                       | ALL    | Create new order       |
| PUT    | `/api/orders/{id}/status?status=..` | ADMIN  | Update order status    |

### Admin (ADMIN Only)
| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| GET    | `/api/admin/stats`     | Dashboard statistics |
| GET    | `/api/admin/users`     | List all users       |
| GET    | `/api/admin/users/{id}`| Get user by ID       |
| DELETE | `/api/admin/users/{id}`| Delete user          |

---

## 📝 Example API Requests & Responses

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@warehouse.com",
    "password": "test123",
    "role": "STAFF"
  }'
```
**Response (201):**
```json
{
  "message": "User registered successfully!",
  "success": true
}
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@warehouse.com",
    "password": "admin123"
  }'
```
**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "Admin User",
  "email": "admin@warehouse.com",
  "roles": ["ROLE_ADMIN"]
}
```

### Create Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Bluetooth Speaker",
    "description": "Portable waterproof speaker",
    "price": 59.99,
    "categoryId": 1
  }'
```

### Create Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orderType": "INBOUND",
    "items": [
      { "productId": 1, "quantity": 25 },
      { "productId": 3, "quantity": 50 }
    ]
  }'
```

---

## 🚀 Render Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "WMS Backend ready for deployment"
git push origin main
```

### Step 2: Create Render PostgreSQL
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Name: `warehouse-db`
4. Plan: Free
5. Click **Create Database**
6. Copy the **Internal Database URL**, **Username**, and **Password**

### Step 3: Deploy Backend on Render
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `warehouse-api`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `frontend/backend`
   - **Runtime:** Java
   - **Build Command:** `mvn clean install -DskipTests`
   - **Start Command:** `java -jar target/warehouse-management-system-1.0.0.jar`
4. Add **Environment Variables:**

| Key          | Value                                    |
|--------------|------------------------------------------|
| DB_URL       | jdbc:postgresql://[internal-host]/[db]   |
| DB_USERNAME  | [from Render PostgreSQL]                 |
| DB_PASSWORD  | [from Render PostgreSQL]                 |
| JWT_SECRET   | your-production-secret-key-min-32-chars  |
| PORT         | 8080                                     |

5. Click **Create Web Service**

### Step 4: Verify Deployment
- API will be live at: `https://warehouse-api.onrender.com`
- Swagger: `https://warehouse-api.onrender.com/swagger-ui.html`

---

## 📦 Postman Collection
Import `WMS_API_Postman_Collection.json` into Postman to test all endpoints.
Set the `baseUrl` variable to your deployed URL.

---

## 🗃️ Database Schema

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  users   │────→│user_roles│←────│    roles     │
│          │     │          │     │              │
│ id       │     │ user_id  │     │ id           │
│ name     │     │ role_id  │     │ role_name    │
│ email    │     └──────────┘     └──────────────┘
│ password │
└──────────┘
      │
      │ (user_id)
      ▼
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  orders  │────→│ order_items  │←────│  products    │
│          │     │              │     │              │
│ id       │     │ id           │     │ id           │
│ user_id  │     │ order_id     │     │ name         │
│ type     │     │ product_id   │     │ description  │
│ status   │     │ quantity     │     │ price        │
└──────────┘     └──────────────┘     │ category_id  │
                                      └──────┬───────┘
                                             │
                                    ┌────────┴───────┐
                                    │  categories    │
                                    │ id, name       │
                                    └────────────────┘

┌──────────────┐     ┌──────────────────┐
│  inventory   │     │ stock_movements  │
│              │     │                  │
│ id           │     │ id               │
│ product_id   │     │ product_id       │
│ quantity     │     │ quantity         │
│ location     │     │ movement_type    │
└──────────────┘     │ timestamp        │
                     └──────────────────┘
```
