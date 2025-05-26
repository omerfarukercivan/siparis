package com.faruk.control.order;

import com.faruk.control.BaseControl;
import com.faruk.control.RootEntity;
import com.faruk.dto.order.DtoOrder;
import com.faruk.dto.order.DtoOrderIU;
import com.faruk.service.order.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/api/order")
public class OrderControl extends BaseControl implements IOrderControl {

    @Autowired
    private IOrderService orderService;

    @PostMapping("/create")
    @Override
    public RootEntity<DtoOrder> createOrder(@RequestBody DtoOrderIU dtoOrderIU) {
        return ok(orderService.createOrder(dtoOrderIU));
    }

    @DeleteMapping("/delete/{id}")
    @Override
    public void deleteOrder(@PathVariable(name = "id") String orderCode) {
        orderService.deleteOrder(orderCode);
    }

    @GetMapping("/get-by-order")
    @Override
    public RootEntity<DtoOrder> getOrderByOrderCode(@RequestParam(name = "orderCode") String orderCode) {
        return ok(orderService.getOrderByOrderCode(orderCode));
    }

    @GetMapping("/get-by-outlet")
    @Override
    public RootEntity<DtoOrder> getOrderByOutletCode(@RequestParam(name = "outletCode") String outletCode) {
        return ok(orderService.getOrderByOutletCode(outletCode));
    }

    @PutMapping("/accept/{id}")
    @Override
    public RootEntity<DtoOrder> orderAccept(@PathVariable(name = "id") String orderCode) {
        return ok(orderService.orderAccept(orderCode));
    }

    @PutMapping("/reject/{id}")
    @Override
    public RootEntity<DtoOrder> orderReject(@PathVariable(name = "id") String orderCode) {
        return ok(orderService.orderReject(orderCode));
    }

    @GetMapping("/list")
    @Override
    public RootEntity<List<DtoOrder>> getAllOrder() {
        return ok(orderService.getAllOrder());
    }
}
