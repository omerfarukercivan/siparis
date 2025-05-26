package com.faruk.control.product;

import com.faruk.control.BaseControl;
import com.faruk.control.RootEntity;
import com.faruk.dto.product.DtoProduct;
import com.faruk.dto.product.DtoProductIU;
import com.faruk.service.product.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/api/product")
public class ProductControl extends BaseControl implements IProductControl {

    @Autowired
    private IProductService productService;

    @PostMapping("/save")
    @Override
    public RootEntity<DtoProduct> saveProduct(@RequestBody DtoProductIU dtoProductIU) {
        return ok(productService.saveProduct(dtoProductIU));
    }

    @GetMapping("/list")
    @Override
    public RootEntity<List<DtoProduct>> getAllProduct() {
        return ok(productService.getAllProduct());
    }
}
