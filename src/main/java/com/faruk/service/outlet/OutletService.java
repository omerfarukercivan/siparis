package com.faruk.service.outlet;

import com.faruk.dto.outlet.DtoOutlet;
import com.faruk.dto.outlet.DtoOutletIU;
import com.faruk.model.Outlet;
import com.faruk.repository.OutletRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OutletService implements IOutletService {

    @Autowired
    private OutletRepository outletRepository;

    @Override
    public DtoOutlet saveOutlet(DtoOutletIU dtoOutletIU) {
        DtoOutlet dtoOutlet = new DtoOutlet();
        Outlet outlet = new Outlet();

        BeanUtils.copyProperties(dtoOutletIU, outlet);
        Outlet dbOutlet = outletRepository.save(outlet);
        BeanUtils.copyProperties(dbOutlet, dtoOutlet);

        return dtoOutlet;
    }

    @Override
    public List<DtoOutlet> getAllOutlet() {
        List<DtoOutlet> dtoList=new ArrayList<>();
        List<Outlet> outletList=outletRepository.findAll();

        for (Outlet outlet:outletList){
            DtoOutlet dtoOutlet=new DtoOutlet();
            BeanUtils.copyProperties(outlet,dtoOutlet);
            dtoList.add(dtoOutlet);
        }
        return dtoList;
    }
}
