import { Token } from "../token";

export class ParserError extends Error {
    token: Token;

    constructor(token: Token, message: string) {
        super(message);
        this.token = token;
        Object.setPrototypeOf(this, ParserError.prototype);
    }
}
