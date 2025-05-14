package com.faruk.dto.order;

import com.faruk.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoOrder {
    private Integer quantity;
    private String orderCode;
    private String productId;
    private String outletId;
    private OrderStatus status;
}