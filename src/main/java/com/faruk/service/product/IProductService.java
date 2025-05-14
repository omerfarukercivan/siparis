package com.faruk.service.product;

import com.faruk.dto.product.DtoProduct;
import com.faruk.dto.product.DtoProductIU;

import java.util.List;

public interface IProductService {
    public DtoProduct saveProduct(DtoProductIU dtoProductIU);
    public List<DtoProduct> getAllProduct();
}
