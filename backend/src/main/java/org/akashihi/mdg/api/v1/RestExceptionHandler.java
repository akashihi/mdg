package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.Problem;
import org.akashihi.mdg.dao.ErrorRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.akashihi.mdg.entity.Error;

@ControllerAdvice
@RequiredArgsConstructor
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    private final ErrorRepository errorRepository;

    protected Error constructMissingProblem(MdgException ex) {
        return new Error(ex.getCode(), 500, "Undocumented error", "An error was emitted, which is not yet documented");
    }

    @ExceptionHandler({MdgException.class})
    public ResponseEntity<Object> handleRestException(MdgException ex, WebRequest request) {
        var error = errorRepository.findById(ex.getCode()).orElseGet(() -> constructMissingProblem(ex));
        var problem = new Problem(error.getTitle(), error.getStatus(), request.getContextPath(), error.getCode(), error.getDetail());
        var headers = new HttpHeaders();
        headers.set("Content-Type", "application/vnd.mdg+json;version=1");
        return new ResponseEntity<>(problem, headers, error.getStatus());
    }
}
