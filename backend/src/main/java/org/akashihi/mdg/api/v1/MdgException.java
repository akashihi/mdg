package org.akashihi.mdg.api.v1;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class MdgException extends RuntimeException {
    private final String code;
    public MdgException(String code) {
        super();
        this.code = code;
    }
    public MdgException(String code, Throwable cause) {
        super(cause);
        this.code = code;
    }
}
