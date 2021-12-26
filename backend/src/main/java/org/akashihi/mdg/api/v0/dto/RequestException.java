package org.akashihi.mdg.api.v0.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class RequestException extends RuntimeException {
    private final Integer statusCode;
    private final String errorCode;
}
