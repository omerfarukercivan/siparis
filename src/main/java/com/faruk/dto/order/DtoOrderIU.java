package com.faruk.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoOrderIU {
    private String orderCode;
    private String outletCode;
    private List<ProductItem> products;
}
