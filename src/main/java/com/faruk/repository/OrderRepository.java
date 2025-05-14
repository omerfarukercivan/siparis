package com.faruk.repository;

import com.faruk.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByOrderCode(String orderCode);
    List<Order> findByOutletCode(String outletCode);
}
