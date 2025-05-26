package com.faruk.exception;

import lombok.Getter;

@Getter
public enum MessageType {
    PRODUCT_ALREADY_EXIST("1001", "Bu koda ait ürün bulunmaktadır"),
    OUTLET_ALREADY_EXIST("1002", "Bu koda ait bayi bulunmaktadır"),
    ORDER_ALREADY_EXIST("1003", "Bu koda ait sipariş bulunmaktadır"),
    PRODUCT_QUANTITY_EXCEEDS("1004", "İstenen ürün miktarı stokta mevcut değil.");

    private String code;
    private String message;

    MessageType(String code, String message) {
        this.code = code;
        this.message = message;
    }
}