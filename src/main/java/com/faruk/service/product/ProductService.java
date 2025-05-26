package com.faruk.service.product;

import com.faruk.dto.product.DtoProduct;
import com.faruk.dto.product.DtoProductIU;
import com.faruk.exception.BaseException;
import com.faruk.exception.ErrorMessage;
import com.faruk.exception.MessageType;
import com.faruk.model.Product;
import com.faruk.repository.ProductRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ProductService implements IProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public DtoProduct saveProduct(DtoProductIU dtoProductIU) {
        DtoProduct dtoProduct = new DtoProduct();
        Product product = new Product();

        if (isProductExist(dtoProductIU)){
            throw new BaseException(new ErrorMessage(MessageType.PRODUCT_ALREADY_EXIST, product.getProductCode()));
        }

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

    private boolean isProductExist(DtoProductIU dtoProductIU){
        List<Product> productList = productRepository.findAll();
        for (Product product : productList) {
            return Objects.equals(product.getProductCode(), dtoProductIU.getProductCode());
        }
        return false;
    }
}