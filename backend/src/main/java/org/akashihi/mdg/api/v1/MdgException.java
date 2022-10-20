package org.akashihi.mdg.api.v1;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class MdgException extends RuntimeException {
    private final String title;
    private final Integer status;
    private final String instance;
    private final String code;
    private final String detail;
    public MdgException(String code, Throwable cause) {
        super(cause);
        this.code = code;
        this.title = "";
        this.status = 0;
        this.instance = "";
        this.detail = "";
    }
    public MdgException(String c, Integer s, String i, Throwable cause) {
        super(cause);
        this.title = c;
        this.code = c;
        this.status = s;
        this.instance = i;
        this.detail = "";
    }

    public MdgException(String c, Integer s, String i) {
        super();
        this.title = c;
        this.code = c;
        this.status = s;
        this.instance = i;
        this.detail = "";
    }
}
