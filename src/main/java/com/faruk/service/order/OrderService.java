package com.faruk.service.order;

import com.faruk.dto.order.DtoOrder;
import com.faruk.dto.order.DtoOrderIU;
import com.faruk.dto.order.ProductItem;
import com.faruk.model.*;
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

    @Override
    public List<DtoOrder> createOrder(DtoOrderIU dtoOrderIU) {
        List<ProductItem> productItemList = dtoOrderIU.getProducts();
        Outlet outlet = outletRepository.findByOutletCode(dtoOrderIU.getOutletCode());
        List<DtoOrder> dtoOrderList = new ArrayList<>();

        for (ProductItem productItem : productItemList) {
            Product product = productRepository.findByProductCode(productItem.getProductCode());
            Order order = new Order();
            DtoOrder dtoOrder = new DtoOrder();

            order.setOrderCode(dtoOrderIU.getOrderCode());
            order.setOutletCode(dtoOrderIU.getOutletCode());
            order.setOutletId(outlet.getId().toString());
            order.setProductId(product.getId().toString());
            order.setQuantity(productItem.getQuantity());
            order.setStatus(OrderStatus.PENDING);

            orderRepository.save(order);

            BeanUtils.copyProperties(order, dtoOrder);
            dtoOrderList.add(dtoOrder);
        }
        return dtoOrderList;
    }

    @Override
    public void deleteOrder(Integer id) {
        Optional<Order> optional = orderRepository.findById(id);
        if (optional.isPresent()) {
            orderRepository.delete(optional.get());
        }
    }

    @Override
    public List<DtoOrder> getOrderByOrderCode(String orderCode) {
        List<Order> orderList = orderRepository.findByOrderCode(orderCode);
        List<DtoOrder> dtoOrderList = new ArrayList<>();

        for (Order order : orderList) {
            DtoOrder dtoOrder = new DtoOrder();
            BeanUtils.copyProperties(order, dtoOrder);
            dtoOrderList.add(dtoOrder);
        }
        return dtoOrderList;
    }

    @Override
    public List<DtoOrder> getOrderByOutletCode(String outletCode) {
        Outlet outlet = outletRepository.findByOutletCode(outletCode);
        List<Order> orderList = orderRepository.findByOutletCode(outlet.getOutletCode());
        List<DtoOrder> dtoOrderList = new ArrayList<>();

        for (Order order : orderList) {
            DtoOrder dtoOrder = new DtoOrder();
            BeanUtils.copyProperties(order, dtoOrder);
            dtoOrderList.add(dtoOrder);
        }
        return dtoOrderList;
    }

    @Override
    public List<DtoOrder> orderAccept(String orderCode) {
        List<Order> orderList = orderRepository.findByOrderCode(orderCode);
        List<DtoOrder> dtoOrderList=new ArrayList<>();

        for (Order order : orderList) {
            DtoOrder dtoOrder = new DtoOrder();

            order.setStatus(OrderStatus.ACCEPTED);
            orderRepository.save(order);
            BeanUtils.copyProperties(order, dtoOrder);
            dtoOrderList.add(dtoOrder);
        }
        return dtoOrderList;
    }

    @Override
    public List<DtoOrder> orderReject(String orderCode) {
        List<Order> orderList = orderRepository.findByOrderCode(orderCode);
        List<DtoOrder> dtoOrderList=new ArrayList<>();

        for (Order order : orderList) {
            DtoOrder dtoOrder = new DtoOrder();

            order.setStatus(OrderStatus.REJECTED);
            orderRepository.save(order);
            BeanUtils.copyProperties(order, dtoOrder);
            dtoOrderList.add(dtoOrder);
        }
        return dtoOrderList;
    }
}