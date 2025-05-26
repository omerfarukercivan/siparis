package com.faruk.control;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class RootEntity<T> {
    private Integer status;
    private T result;
    private String errorMessage;

    public static <T> RootEntity<T> ok(T result) {
        RootEntity<T> rootEntity = new RootEntity<>();

        rootEntity.setStatus(200);
        rootEntity.setResult(result);
        rootEntity.setErrorMessage(null);

        return rootEntity;
    }

    public static <T> RootEntity<T> error(String errorMessage) {
        RootEntity<T> rootEntity = new RootEntity<>();

        rootEntity.setStatus(500);
        rootEntity.setResult(null);
        rootEntity.setErrorMessage(errorMessage);

        return rootEntity;
    }
}