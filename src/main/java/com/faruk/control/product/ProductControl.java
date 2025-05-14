package com.faruk.control.product;

import com.faruk.dto.product.DtoProduct;
import com.faruk.dto.product.DtoProductIU;
import com.faruk.service.product.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/api/product")
public class ProductControl implements IProductControl {

    @Autowired
    private IProductService productService;

    @PostMapping(path = "/save")
    @Override
    public DtoProduct saveProduct(@RequestBody DtoProductIU dtoProductIU) {
        return productService.saveProduct(dtoProductIU);
    }

    @GetMapping(path = "/list")
    @Override
    public List<DtoProduct> getAllProduct() {
        return productService.getAllProduct();
    }
}
