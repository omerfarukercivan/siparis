package com.faruk.handler;

import com.faruk.exception.BaseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = BaseException.class)
    public ResponseEntity<ApiError<?>> handleBaseException(BaseException ex) {
        return ResponseEntity.badRequest().body(createApiError(ex.getMessage()));
    }

    public <E> ApiError<E> createApiError(E message) {
        ApiError<E> apiError = new ApiError<>();
        apiError.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());

        Exception<E> exception = new Exception<>();
        exception.setMessage(message);

        apiError.setException(exception);

        return apiError;
    }
}
