package com.faruk.repository;

import com.faruk.model.OrderProduct;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Transactional
@Repository
public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {
    void deleteByOrderId(Integer orderId);
    List<OrderProduct> findByOrderId(Integer orderId);
}
