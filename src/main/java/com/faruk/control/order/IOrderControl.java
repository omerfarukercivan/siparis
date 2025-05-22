package com.faruk.control.order;

import com.faruk.dto.order.DtoOrder;
import com.faruk.dto.order.DtoOrderIU;

public interface IOrderControl {
    public DtoOrder createOrder(DtoOrderIU dtoOrderIU);
    public void deleteOrder(Integer id);
    public DtoOrder getOrderByOrderCode(String orderCode);
    public DtoOrder getOrderByOutletCode(String outletCode);
    public DtoOrder orderAccept(String orderCode);
    public DtoOrder orderReject(String orderCode);
}
