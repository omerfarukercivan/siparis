package com.faruk.control.outlet;

import com.faruk.control.BaseControl;
import com.faruk.control.RootEntity;
import com.faruk.dto.outlet.DtoOutlet;
import com.faruk.dto.outlet.DtoOutletIU;
import com.faruk.service.outlet.IOutletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/api/outlet")
public class OutletControl extends BaseControl implements IOutletControl {

    @Autowired
    private IOutletService outletService;

    @PostMapping("/save")
    @Override
    public RootEntity<DtoOutlet> saveOutlet(@RequestBody DtoOutletIU dtoOutletIU) {
        return ok(outletService.saveOutlet(dtoOutletIU));
    }

    @GetMapping("/list")
    @Override
    public RootEntity<List<DtoOutlet>> getAllOutlet() {
        return ok(outletService.getAllOutlet());
    }
}
