package com.faruk.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoProductIU {
    private Integer size;
    private String productCode;
    private String name;
}
