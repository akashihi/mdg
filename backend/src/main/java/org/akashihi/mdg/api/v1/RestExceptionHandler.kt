package org.akashihi.mdg.api.v1

import org.akashihi.mdg.api.v1.MdgException
import org.akashihi.mdg.dao.ErrorRepository
import org.akashihi.mdg.entity.Error
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.ServletWebRequest
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

data class Problem(val title: String, val status: Int, val instance: String?, val code: String, val detail: String)
@ControllerAdvice
open class RestExceptionHandler(private val errorRepository: ErrorRepository) : ResponseEntityExceptionHandler() {
    private fun constructMissingProblem(ex: MdgException): Error {
        return Error(ex.code, 500, "Undocumented error", "An error was emitted, which is not yet documented")
    }

    private fun processError(error: Error, request: WebRequest): ResponseEntity<Problem> {
        var url: String? = null
        if (request is ServletWebRequest) {
            url = request.request.requestURI
        }
        val problem = Problem(error.title, error.status, url, error.code, error.detail)
        val headers = HttpHeaders()
        headers["Content-Type"] = "application/vnd.mdg+json;version=1"
        return ResponseEntity(problem, headers, error.status)
    }

    @ExceptionHandler(MdgException::class)
    fun handleRestException(ex: MdgException, request: WebRequest): ResponseEntity<Problem> {
        val error = errorRepository.findByIdOrNull(ex.code) ?: constructMissingProblem(ex)
        return processError(error, request)
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception, request: WebRequest): ResponseEntity<Problem> {
        if (log.isWarnEnabled) {
            log.warn(ex.message, ex)
        }
        val error = Error("UNHANDLED_EXCEPTION", 500, ex.message, "An unhandled exception happened")
        return processError(error, request)
    }

    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        @JvmStatic
        private val log = LoggerFactory.getLogger(javaClass.enclosingClass)
    }
}