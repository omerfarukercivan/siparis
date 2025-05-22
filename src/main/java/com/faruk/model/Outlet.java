package com.faruk.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "outlet")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Outlet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "outlet_code")
    private String outletCode;

    private String address;

    @Column(name = "sign_name")
    private String signName;

    private Double longitude;

    private Double latitude;
}
