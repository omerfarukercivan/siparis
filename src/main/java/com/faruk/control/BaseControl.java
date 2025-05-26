package com.faruk.control;

public class BaseControl {
    public <T> RootEntity<T> ok(T result) {
        return RootEntity.ok(result);
    }

    public <T> RootEntity<T> error(String errorMessage) {
        return RootEntity.error(errorMessage);
    }
}
