package org.akashihi.mdg.api.v1;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class RestException extends RuntimeException {
    private final String title;
    private final Integer status;
    private final String instance;
    public RestException(String t, Integer s, String i, Throwable cause) {
        super(cause);
        this.title = t;
        this.status = s;
        this.instance = i;
    }

    public RestException(String t, Integer s, String i) {
        super();
        this.title = t;
        this.status = s;
        this.instance = i;
    }
}
