package com.faruk.dto.order;

import com.faruk.model.OrderStatus;
import com.faruk.model.Outlet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoOrder {
    private Outlet outlet;
    private String orderCode;
    private OrderStatus status;
    private List<ProductItem> products;
}