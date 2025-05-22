package com.faruk.service.order;

import com.faruk.dto.order.DtoOrder;
import com.faruk.dto.order.DtoOrderIU;
import com.faruk.dto.order.ProductItem;
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
    public DtoOrder createOrder(DtoOrderIU dtoOrderIU) {
        List<ProductItem> productItemList = dtoOrderIU.getProducts();
        Outlet outlet = outletRepository.findByOutletCode(dtoOrderIU.getOutletCode());
        Order order = new Order();
        DtoOrder dtoOrder = new DtoOrder();

        order.setOrderCode(dtoOrderIU.getOrderCode());
        order.setOutletCode(dtoOrderIU.getOutletCode());
        order.setOutlet(outlet);
        orderRepository.save(order);
        BeanUtils.copyProperties(order, dtoOrder);

        for (ProductItem productItem : productItemList) {
            Product product = productRepository.findByProductCode(productItem.getProductCode());
            OrderProduct orderProduct = new OrderProduct();

            orderProduct.setOrder(order);
            orderProduct.setOutlet(outlet);
            orderProduct.setProduct(product);
            orderProduct.setQuentity(productItem.getQuantity());

            orderProductRepository.save(orderProduct);
            dtoOrder.setProducts(productItemList);
        }
        return dtoOrder;
    }

    @Override
    public void deleteOrder(Integer id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            try {
                orderProductRepository.deleteByOrderId(optionalOrder.get().getId());
                orderRepository.delete(optionalOrder.get());
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    @Override
    public DtoOrder getOrderByOrderCode(String orderCode) {
        Order order=orderRepository.findByOrderCode(orderCode);
        List<OrderProduct> orderProductList=orderProductRepository.findByOrderId(order.getId());
        DtoOrder dtoOrder=new DtoOrder();
        ProductItem productItem=new ProductItem();
        List<ProductItem> productItemList=new ArrayList<>();

        BeanUtils.copyProperties(order,dtoOrder);

        for (OrderProduct orderProduct: orderProductList){
            productItem.setProductCode(orderProduct.getProduct().getProductCode());
            productItem.setQuantity(orderProduct.getQuentity());
            productItemList.add(productItem);
            System.out.println("dtoOrder: "+productItem);
        }
        dtoOrder.setProducts(productItemList);

        return dtoOrder;
    }

    @Override
    public DtoOrder getOrderByOutletCode(String outletCode) {
        Outlet outlet = outletRepository.findByOutletCode(outletCode);
        Order order = orderRepository.findByOutletCode(outlet.getOutletCode());
        List<OrderProduct> orderProductList=orderProductRepository.findByOrderId(order.getId());
        DtoOrder dtoOrder=new DtoOrder();
        ProductItem productItem=new ProductItem();
        List<ProductItem> productItemList=new ArrayList<>();

        BeanUtils.copyProperties(order,dtoOrder);

        for (OrderProduct orderProduct : orderProductList) {
            productItem.setProductCode(orderProduct.getProduct().getProductCode());
            productItem.setQuantity(orderProduct.getQuentity());
            productItemList.add(productItem);
            System.out.println("dtoOrder: "+productItem);
        }
        dtoOrder.setProducts(productItemList);

        return dtoOrder;
    }

    @Override
    public DtoOrder orderAccept(String orderCode) {
        Order order=orderRepository.findByOrderCode(orderCode);
        order.setStatus(OrderStatus.ACCEPTED);
        List<OrderProduct> orderProductList=orderProductRepository.findByOrderId(order.getId());
        DtoOrder dtoOrder=new DtoOrder();
        ProductItem productItem=new ProductItem();
        List<ProductItem> productItemList=new ArrayList<>();

        BeanUtils.copyProperties(order,dtoOrder);

        for (OrderProduct orderProduct: orderProductList){
            productItem.setProductCode(orderProduct.getProduct().getProductCode());
            productItem.setQuantity(orderProduct.getQuentity());
            productItemList.add(productItem);
            System.out.println("dtoOrder: "+productItem);
        }
        dtoOrder.setProducts(productItemList);

        return dtoOrder;
    }

    @Override
    public DtoOrder orderReject(String orderCode) {
        Order order=orderRepository.findByOrderCode(orderCode);
        order.setStatus(OrderStatus.REJECTED);
        List<OrderProduct> orderProductList=orderProductRepository.findByOrderId(order.getId());
        DtoOrder dtoOrder=new DtoOrder();
        ProductItem productItem=new ProductItem();
        List<ProductItem> productItemList=new ArrayList<>();

        BeanUtils.copyProperties(order,dtoOrder);

        for (OrderProduct orderProduct: orderProductList){
            productItem.setProductCode(orderProduct.getProduct().getProductCode());
            productItem.setQuantity(orderProduct.getQuentity());
            productItemList.add(productItem);
            System.out.println("dtoOrder: "+productItem);
        }
        dtoOrder.setProducts(productItemList);

        return dtoOrder;
    }
}