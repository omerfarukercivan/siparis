package com.faruk.control.outlet;

import com.faruk.control.RootEntity;
import com.faruk.dto.outlet.DtoOutlet;
import com.faruk.dto.outlet.DtoOutletIU;

import java.util.List;

public interface IOutletControl {
    public RootEntity<DtoOutlet> saveOutlet(DtoOutletIU dtoOutletIU);
    public RootEntity<List<DtoOutlet>> getAllOutlet();
}
