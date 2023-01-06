package org.akashihi.mdg.api.v1

class MdgException : RuntimeException {
    val code: String

    constructor(code: String) : super() {
        this.code = code
    }

    constructor(code: String, cause: Throwable?) : super(cause) {
        this.code = code
    }
}