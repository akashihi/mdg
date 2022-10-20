package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.akashihi.mdg.api.v1.dto.Problem;
import org.akashihi.mdg.dao.ErrorRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.akashihi.mdg.entity.Error;

@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    private final ErrorRepository errorRepository;

    protected Error constructMissingProblem(MdgException ex) {
        return new Error(ex.getCode(), 500, "Undocumented error", "An error was emitted, which is not yet documented");
    }

    public ResponseEntity<Problem> processError(Error error, WebRequest request) {
        String url = null;
        if (request instanceof ServletWebRequest swr) {
            url = swr.getRequest().getRequestURI();
        }
        var problem = new Problem(error.getTitle(), error.getStatus(), url, error.getCode(), error.getDetail());
        var headers = new HttpHeaders();
        headers.set("Content-Type", "application/vnd.mdg+json;version=1");
        return new ResponseEntity<>(problem, headers, error.getStatus());
    }
    @ExceptionHandler({MdgException.class})
    public ResponseEntity<Problem> handleRestException(MdgException ex, WebRequest request) {
        var error = errorRepository.findById(ex.getCode()).orElseGet(() -> constructMissingProblem(ex));
        return processError(error, request);
    }

    @ExceptionHandler({Exception.class})
    public ResponseEntity<Problem> handleGenericException(Exception ex, WebRequest request) {
        log.warn(ex.getMessage(), ex);
        var error = new Error("UNHANDLED_EXCEPTION", 500, ex.getMessage(), "An unhandled exception happened");
        return processError(error, request);
    }
}
