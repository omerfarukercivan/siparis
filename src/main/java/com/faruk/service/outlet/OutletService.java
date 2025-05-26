package com.faruk.service.outlet;

import com.faruk.dto.outlet.DtoOutlet;
import com.faruk.dto.outlet.DtoOutletIU;
import com.faruk.exception.BaseException;
import com.faruk.exception.ErrorMessage;
import com.faruk.exception.MessageType;
import com.faruk.model.Outlet;
import com.faruk.repository.OutletRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class OutletService implements IOutletService {

    @Autowired
    private OutletRepository outletRepository;

    @Override
    public DtoOutlet saveOutlet(DtoOutletIU dtoOutletIU) {
        DtoOutlet dtoOutlet = new DtoOutlet();
        Outlet outlet = new Outlet();

        if (isOutletExist(dtoOutletIU)) {
            throw new BaseException(new ErrorMessage(MessageType.OUTLET_ALREADY_EXIST, outlet.getOutletCode()));
        }

        BeanUtils.copyProperties(dtoOutletIU, outlet);
        Outlet dbOutlet = outletRepository.save(outlet);
        BeanUtils.copyProperties(dbOutlet, dtoOutlet);

        return dtoOutlet;
    }

    @Override
    public List<DtoOutlet> getAllOutlet() {
        List<DtoOutlet> dtoList = new ArrayList<>();
        List<Outlet> outletList = outletRepository.findAll();

        for (Outlet outlet : outletList) {
            DtoOutlet dtoOutlet = new DtoOutlet();
            BeanUtils.copyProperties(outlet, dtoOutlet);
            dtoList.add(dtoOutlet);
        }
        return dtoList;
    }

    private boolean isOutletExist(DtoOutletIU dtoOutletIU) {
        List<Outlet> outletList = outletRepository.findAll();
        for (Outlet outlet : outletList) {
            return Objects.equals(outlet.getOutletCode(), dtoOutletIU.getOutletCode());
        }
        return false;
    }
}
