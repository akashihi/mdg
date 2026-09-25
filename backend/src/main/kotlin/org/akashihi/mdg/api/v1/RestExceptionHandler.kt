package org.akashihi.mdg.api.v1

import org.akashihi.mdg.dao.ErrorRepository
import org.akashihi.mdg.entity.Error
import org.slf4j.LoggerFactory
import org.springframework.beans.TypeMismatchException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.BindException
import org.springframework.web.HttpMediaTypeNotAcceptableException
import org.springframework.web.HttpMediaTypeNotSupportedException
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.ServletRequestBindingException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.context.request.ServletWebRequest
import org.springframework.web.context.request.WebRequest
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import org.springframework.web.multipart.support.MissingServletRequestPartException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

data class Problem(val title: String, val status: Int, val instance: String?, val code: String, val detail: String)

@ControllerAdvice
open class RestExceptionHandler(private val errorRepository: ErrorRepository) : ResponseEntityExceptionHandler() {
    private fun constructMissingProblem(ex: MdgException): Error {
        return Error(500, "Undocumented error", "An error was emitted, which is not yet documented", ex.code)
    }

    private fun problemFor(error: Error, request: WebRequest): Problem {
        var url: String? = null
        if (request is ServletWebRequest) {
            url = request.request.requestURI
        }
        return Problem(error.title, error.status, url, error.code, error.detail)
    }

    private fun processError(error: Error, request: WebRequest): ResponseEntity<Problem> {
        val headers = HttpHeaders()
        headers["Content-Type"] = "application/vnd.mdg+json;version=1"
        return ResponseEntity(problemFor(error, request), headers, error.status)
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
        val error = Error(500, ex.message ?: "No message provided", "An unhandled exception happened", "UNHANDLED_EXCEPTION")
        return processError(error, request)
    }

    private fun notFoundCodeForPathVariable(ex: MethodArgumentTypeMismatchException): String? {
        if (!ex.parameter.hasParameterAnnotation(PathVariable::class.java)) {
            return null
        }
        return when (ex.parameter.containingClass) {
            AccountController::class.java -> "ACCOUNT_NOT_FOUND"
            CategoryController::class.java -> "CATEGORY_NOT_FOUND"
            CurrencyController::class.java -> "CURRENCY_NOT_FOUND"
            TransactionController::class.java -> "TRANSACTION_NOT_FOUND"
            ReportController::class.java -> "BUDGET_NOT_FOUND" // budget_id is its only path variable
            BudgetController::class.java -> if (ex.name == "entryId") "BUDGETENTRY_NOT_FOUND" else "BUDGET_NOT_FOUND"
            else -> null // RateController: ts is a moment in time, not a resource id
        }
    }

    private fun errorCodeFor(ex: Exception): String? = when (ex) {
        is MethodArgumentTypeMismatchException -> notFoundCodeForPathVariable(ex) ?: "REQUEST_PARAMETER_INVALID"
        is TypeMismatchException -> "REQUEST_PARAMETER_INVALID"
        is BindException -> "REQUEST_PARAMETER_INVALID"
        is HttpMessageNotReadableException -> "REQUEST_BODY_INVALID"
        is ServletRequestBindingException -> "REQUEST_PARAMETER_MISSING"
        is MissingServletRequestPartException -> "REQUEST_PARAMETER_MISSING"
        is HttpMediaTypeNotSupportedException -> "REQUEST_MEDIATYPE_UNSUPPORTED"
        is HttpMediaTypeNotAcceptableException -> "REQUEST_MEDIATYPE_UNACCEPTABLE"
        is HttpRequestMethodNotSupportedException -> "REQUEST_METHOD_UNSUPPORTED"
        else -> null
    }

    override fun handleExceptionInternal(
        ex: Exception,
        body: Any?,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {
        val code = errorCodeFor(ex)
        val error = code?.let { errorRepository.findByIdOrNull(it) }
            ?: Error(status.value(), "Request could not be processed", "The request was rejected before it reached the application", code ?: "REQUEST_INVALID")
        headers["Content-Type"] = "application/vnd.mdg+json;version=1"
        return super.handleExceptionInternal(ex, problemFor(error, request), headers, HttpStatus.valueOf(error.status), request)
    }

    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        @JvmStatic
        private val log = LoggerFactory.getLogger(javaClass.enclosingClass)
    }
}
