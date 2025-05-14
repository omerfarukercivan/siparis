package com.faruk.control.outlet;

import com.faruk.dto.outlet.DtoOutlet;
import com.faruk.dto.outlet.DtoOutletIU;
import com.faruk.service.outlet.IOutletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/api/outlet")
public class OutletControl implements IOutletControl{

    @Autowired
    private IOutletService outletService;

    @PostMapping(path = "/save")
    @Override
    public DtoOutlet saveOutlet(@RequestBody DtoOutletIU dtoOutletIU) {
        return outletService.saveOutlet(dtoOutletIU);
    }

    @GetMapping(path = "/list")
    @Override
    public List<DtoOutlet> getAllOutlet() {
        return outletService.getAllOutlet();
    }
}
