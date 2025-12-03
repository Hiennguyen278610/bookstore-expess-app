export class ErrorResponse extends Error {
    constructor(message, statusCode = 400, code, errors) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;

        Object.setPrototypeOf(this, ErrorResponse.prototype);
    }
}