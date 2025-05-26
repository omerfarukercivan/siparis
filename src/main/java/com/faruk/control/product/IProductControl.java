package com.faruk.control.product;

import com.faruk.control.RootEntity;
import com.faruk.dto.product.DtoProduct;
import com.faruk.dto.product.DtoProductIU;

import java.util.List;

public interface IProductControl {
    public RootEntity<DtoProduct> saveProduct(DtoProductIU dtoProductIU);
    public RootEntity<List<DtoProduct>> getAllProduct();
}
