package com.faruk.service.order;

import com.faruk.dto.order.DtoOrder;
import com.faruk.dto.order.DtoOrderIU;
import com.faruk.dto.order.ProductItem;
import com.faruk.exception.BaseException;
import com.faruk.exception.ErrorMessage;
import com.faruk.exception.MessageType;
import com.faruk.model.*;
import com.faruk.repository.OrderProductRepository;
import com.faruk.repository.OrderRepository;
import com.faruk.repository.OutletRepository;
import com.faruk.repository.ProductRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OutletRepository outletRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Override
    public List<DtoOrder> getAllOrder() {
        List<DtoOrder> dtoOrderList = new ArrayList<>();
        List<Order> orders = orderRepository.findAll();

        for (Order order : orders) {
            List<OrderProduct> orderProductList = orderProductRepository.findByOrderId(order.getId());
            List<ProductItem> productItemList = new ArrayList<>();
            for (OrderProduct orderProduct : orderProductList) {
                ProductItem productItem = new ProductItem();

                productItem.setProductCode(orderProduct.getProduct().getProductCode());
                productItem.setQuantity(orderProduct.getQuentity());

                productItemList.add(productItem);
            }
            DtoOrder dtoOrder = new DtoOrder();
            BeanUtils.copyProperties(order, dtoOrder);
            dtoOrder.setProducts(productItemList);
            dtoOrderList.add(dtoOrder);
        }
        return dtoOrderList;
    }

    @Override
    public DtoOrder createOrder(DtoOrderIU dtoOrderIU) {
        List<ProductItem> productItemList = dtoOrderIU.getProducts();
        Outlet outlet = outletRepository.findByOutletCode(dtoOrderIU.getOutletCode());
        Order order = new Order();
        DtoOrder dtoOrder = new DtoOrder();

        order.setOrderCode(dtoOrderIU.getOrderCode());
        order.setOutletCode(dtoOrderIU.getOutletCode());
        order.setOutlet(outlet);

        checkIfOrderAlreadyExistsForOutlet(dtoOrderIU);
        productQuantityExceeds(dtoOrderIU.getProducts());

        orderRepository.save(order);
        BeanUtils.copyProperties(order, dtoOrder);

        for (ProductItem productItem : productItemList) {
            Product product = productRepository.findByProductCode(productItem.getProductCode());
            OrderProduct orderProduct = new OrderProduct();

            orderProduct.setOrder(order);
            orderProduct.setOutlet(outlet);
            orderProduct.setProduct(product);
            orderProduct.setQuentity(productItem.getQuantity());

            product.setSize(product.getSize() - productItem.getQuantity());
            orderProductRepository.save(orderProduct);
            productRepository.save(product);

            dtoOrder.setProducts(productItemList);
        }
        return dtoOrder;
    }

    @Override
    public void deleteOrder(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode);
        try {
            orderProductRepository.deleteByOrderId(order.getId());
            orderRepository.delete(order);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    @Override
    public DtoOrder getOrderByOrderCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode);
        List<OrderProduct> orderProductList = orderProductRepository.findByOrderId(order.getId());
        DtoOrder dtoOrder = new DtoOrder();
        ProductItem productItem = new ProductItem();
        List<ProductItem> productItemList = new ArrayList<>();

        BeanUtils.copyProperties(order, dtoOrder);

        for (OrderProduct orderProduct : orderProductList) {
            productItem.setProductCode(orderProduct.getProduct().getProductCode());
            productItem.setQuantity(orderProduct.getQuentity());
            productItemList.add(productItem);
        }
        dtoOrder.setProducts(productItemList);

        return dtoOrder;
    }

    @Override
    public DtoOrder getOrderByOutletCode(String outletCode) {
        Outlet outlet = outletRepository.findByOutletCode(outletCode);
        Order order = orderRepository.findByOutletCode(outlet.getOutletCode());
        List<OrderProduct> orderProductList = orderProductRepository.findByOrderId(order.getId());
        DtoOrder dtoOrder = new DtoOrder();
        ProductItem productItem = new ProductItem();
        List<ProductItem> productItemList = new ArrayList<>();

        BeanUtils.copyProperties(order, dtoOrder);

        for (OrderProduct orderProduct : orderProductList) {
            productItem.setProductCode(orderProduct.getProduct().getProductCode());
            productItem.setQuantity(orderProduct.getQuentity());
            productItemList.add(productItem);
        }
        dtoOrder.setProducts(productItemList);

        return dtoOrder;
    }

    @Override
    public DtoOrder orderAccept(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode);
        order.setStatus(OrderStatus.ACCEPTED);
        List<OrderProduct> orderProductList = orderProductRepository.findByOrderId(order.getId());
        DtoOrder dtoOrder = new DtoOrder();
        ProductItem productItem = new ProductItem();
        List<ProductItem> productItemList = new ArrayList<>();

        BeanUtils.copyProperties(order, dtoOrder);

        for (OrderProduct orderProduct : orderProductList) {
            productItem.setProductCode(orderProduct.getProduct().getProductCode());
            productItem.setQuantity(orderProduct.getQuentity());
            productItemList.add(productItem);
        }
        dtoOrder.setProducts(productItemList);

        return dtoOrder;
    }

    @Override
    public DtoOrder orderReject(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode);
        order.setStatus(OrderStatus.REJECTED);
        List<OrderProduct> orderProductList = orderProductRepository.findByOrderId(order.getId());
        DtoOrder dtoOrder = new DtoOrder();
        ProductItem productItem = new ProductItem();
        List<ProductItem> productItemList = new ArrayList<>();

        BeanUtils.copyProperties(order, dtoOrder);

        for (OrderProduct orderProduct : orderProductList) {
            productItem.setProductCode(orderProduct.getProduct().getProductCode());
            productItem.setQuantity(orderProduct.getQuentity());
            productItemList.add(productItem);
        }
        dtoOrder.setProducts(productItemList);

        return dtoOrder;
    }

    private void checkIfOrderAlreadyExistsForOutlet(DtoOrderIU dtoOrderIU) {
        Optional<Order> optionalOrder=orderRepository.findByOrderCodeAndOutletCode(dtoOrderIU.getOrderCode(), dtoOrderIU.getOutletCode());

        String errorMessage = String.format(
                "%s kodlu bayi'nin %s kodlu siparişi bulunmaktadır.",
                dtoOrderIU.getOutletCode(),
                dtoOrderIU.getOrderCode()
        );

        if (optionalOrder.isPresent()){
            throw new BaseException(new ErrorMessage(MessageType.ORDER_ALREADY_EXIST, errorMessage));
        }
    }

    private void productQuantityExceeds(List<ProductItem> productItemList) {
        for (ProductItem item : productItemList) {
            Product product = productRepository.findByProductCode(item.getProductCode());

            if (item.getQuantity() > product.getSize()) {
                String errorMessage = String.format(
                        "Talep edilen miktar %d '%s' ürünü için mevcut stok miktarını %d aşıyor.",
                        item.getQuantity(),
                        product.getName(),
                        product.getSize()
                );
                throw new BaseException(new ErrorMessage(MessageType.PRODUCT_QUANTITY_EXCEEDS, errorMessage));
            }
        }
    }
}