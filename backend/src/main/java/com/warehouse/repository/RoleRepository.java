package com.warehouse.repository;

import com.warehouse.entity.Role;
import com.warehouse.entity.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(RoleName roleName);
    Boolean existsByRoleName(RoleName roleName);
}
