package com.faruk.control.product;

import com.faruk.dto.product.DtoProduct;
import com.faruk.dto.product.DtoProductIU;

import java.util.List;

public interface IProductControl {
    public DtoProduct saveProduct(DtoProductIU dtoProductIU);
    public List<DtoProduct> getAllProduct();
}
