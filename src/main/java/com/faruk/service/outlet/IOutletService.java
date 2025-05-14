package com.faruk.service.outlet;

import com.faruk.dto.outlet.DtoOutlet;
import com.faruk.dto.outlet.DtoOutletIU;

import java.util.List;

public interface IOutletService {
    public DtoOutlet saveOutlet(DtoOutletIU dtoOutletIU);
    public List<DtoOutlet> getAllOutlet();
}
