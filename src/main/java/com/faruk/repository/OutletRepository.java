package com.faruk.repository;

import com.faruk.model.Outlet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OutletRepository extends JpaRepository<Outlet, Integer> {
    Outlet findByOutletCode(String outletCode);
}
