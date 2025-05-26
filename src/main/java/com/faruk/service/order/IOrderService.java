package com.faruk.service.order;

import com.faruk.dto.order.DtoOrder;
import com.faruk.dto.order.DtoOrderIU;

import java.util.List;

public interface IOrderService {
    public List<DtoOrder> getAllOrder();
    public DtoOrder createOrder(DtoOrderIU dtoOrderIU);
    public void deleteOrder(String orderCode);
    public DtoOrder getOrderByOrderCode(String orderCode);
    public DtoOrder getOrderByOutletCode(String outletCode);
    public DtoOrder orderAccept(String orderCode);
    public DtoOrder orderReject(String orderCode);
}
