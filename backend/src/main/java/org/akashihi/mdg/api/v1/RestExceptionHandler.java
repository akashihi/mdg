package org.akashihi.mdg.api.v1;

import org.akashihi.mdg.api.v1.dto.Problem;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler({RestException.class})
    public ResponseEntity<Object> handleRestException(RestException ex, WebRequest request) {
        var error = new Problem(ex.getTitle(), ex.getStatus(), ex.getInstance());
        var headers = new HttpHeaders();
        headers.set("Content-Type", "application/vnd.mdg+json;version=1");
        return new ResponseEntity<>(error, headers, error.status());
    }
}
