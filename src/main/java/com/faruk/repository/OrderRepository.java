package com.faruk.repository;

import com.faruk.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Order findByOrderCode(String orderCode);
    Order findByOutletCode(String outletCode);
}
