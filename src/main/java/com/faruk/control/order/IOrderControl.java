package com.faruk.control.order;

import com.faruk.control.RootEntity;
import com.faruk.dto.order.DtoOrder;
import com.faruk.dto.order.DtoOrderIU;

import java.util.List;

public interface IOrderControl {
    public RootEntity<DtoOrder> createOrder(DtoOrderIU dtoOrderIU);
    public void deleteOrder(String orderCode);
    public RootEntity<DtoOrder> getOrderByOrderCode(String orderCode);
    public RootEntity<DtoOrder> getOrderByOutletCode(String outletCode);
    public RootEntity<DtoOrder> orderAccept(String orderCode);
    public RootEntity<DtoOrder> orderReject(String orderCode);
    public RootEntity<List<DtoOrder>> getAllOrder();
}
