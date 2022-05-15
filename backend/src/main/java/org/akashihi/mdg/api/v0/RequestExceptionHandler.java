package org.akashihi.mdg.api.v0;

import org.akashihi.mdg.api.v0.dto.DataError;
import org.akashihi.mdg.api.v0.dto.RequestException;
import org.akashihi.mdg.api.v1.dto.Problem;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Collections;
import java.util.List;

@ControllerAdvice
public class RequestExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler({RequestException.class})
    public ResponseEntity<Object> handleRestException(RequestException ex, WebRequest request) {
        var entry = new DataError.ErrorEntry(ex.getErrorCode(), ex.getStatusCode());
        var error = new DataError("error", Collections.singletonList(entry));
        var headers = new HttpHeaders();
        headers.set("Content-Type", "application/vnd.mdg+json");
        return new ResponseEntity<>(error, headers, entry.status());
    }

}
