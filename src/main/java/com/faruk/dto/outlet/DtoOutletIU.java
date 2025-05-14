package com.faruk.dto.outlet;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoOutletIU {
    private String outletCode;
    private String address;
    private String signName;
    private Double longitude;
    private Double latitude;
}