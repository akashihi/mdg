package org.akashihi.mdg.api.v0.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class RequestException extends RuntimeException {
    private final Integer statusCode;
    private final String errorCode;

    public RequestException(Integer status, String error) {
        super();
        this.statusCode = status;
        this.errorCode = error;
    }
    public RequestException(Integer status, String error, Throwable cause) {
        super(cause);
        this.statusCode = status;
        this.errorCode = error;
    }
}
