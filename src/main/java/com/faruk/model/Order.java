package com.faruk.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    @Column(name = "order_code")
    private String orderCode;

    @Column(name = "outlet_code")
    private String outletCode;

    @Column(name = "product_id")
    private String productId;

    @Column(name = "outlet_id")
    private String outletId;

    private OrderStatus status;

//    @OneToMany
//    private List<Product> product;
}