package com.faruk.service.product;

import com.faruk.dto.product.DtoProduct;
import com.faruk.dto.product.DtoProductIU;
import com.faruk.model.Product;
import com.faruk.repository.ProductRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService implements IProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public DtoProduct saveProduct(DtoProductIU dtoProductIU) {
        DtoProduct dtoProduct = new DtoProduct();
        Product product = new Product();

        BeanUtils.copyProperties(dtoProductIU, product);
        Product dbProduct = productRepository.save(product);
        BeanUtils.copyProperties(dbProduct, dtoProduct);

        return dtoProduct;
    }

    @Override
    public List<DtoProduct> getAllProduct() {
        List<DtoProduct> dtoList = new ArrayList<>();
        List<Product> productList = productRepository.findAll();

        for (Product product : productList) {
            DtoProduct dtoProduct = new DtoProduct();
            BeanUtils.copyProperties(product, dtoProduct);
            dtoList.add(dtoProduct);
        }
        return dtoList;
    }
}
