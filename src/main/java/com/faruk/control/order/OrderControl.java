package com.faruk.control.order;

import com.faruk.dto.order.DtoOrder;
import com.faruk.dto.order.DtoOrderIU;
import com.faruk.service.order.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/api/order")
public class OrderControl implements IOrderControl {

    @Autowired
    private IOrderService orderService;

    @PostMapping(path = "/create")
    @Override
    public List<DtoOrder> createOrder(@RequestBody DtoOrderIU dtoOrderIU) {
        return orderService.createOrder(dtoOrderIU);
    }

    @DeleteMapping(path = "/delete/{id}")
    @Override
    public void deleteOrder(@PathVariable(name = "id") Integer id) {
        orderService.deleteOrder(id);
    }

    @GetMapping(path = "/get-by-order")
    @Override
    public List<DtoOrder> getOrderByOrderCode(@RequestParam(name = "orderCode") String orderCode) {
        return orderService.getOrderByOrderCode(orderCode);
    }

    @GetMapping(path = "/get-by-outlet")
    @Override
    public List<DtoOrder> getOrderByOutletCode(@RequestParam(name = "outletCode") String outletCode) {
        return orderService.getOrderByOutletCode(outletCode);
    }

    @PutMapping(path = "/accept/{id}")
    @Override
    public List<DtoOrder> orderAccept(@PathVariable(name = "id") String orderCode) {
        return orderService.orderAccept(orderCode);
    }

    @PutMapping(path = "/reject/{id}")
    @Override
    public List<DtoOrder> orderReject(@PathVariable(name = "id") String orderCode) {
        return orderService.orderReject(orderCode);
    }
}
