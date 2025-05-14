package com.faruk.control.order;

import com.faruk.dto.order.DtoOrder;
import com.faruk.dto.order.DtoOrderIU;

import java.util.List;

public interface IOrderControl {
    public List<DtoOrder> createOrder(DtoOrderIU dtoOrderIU);
    public void deleteOrder(Integer id);
    public List<DtoOrder> getOrderByOrderCode(String orderCode);
    public List<DtoOrder> getOrderByOutletCode(String outletCode);
    public List<DtoOrder> orderAccept(String orderCode);
    public List<DtoOrder> orderReject(String orderCode);
}
