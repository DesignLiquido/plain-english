import { Assign } from "../statements/assign";
import { Axiom } from "../statements/axiom";
import { Convert } from "../statements/convert";
import { Statement } from "../statements/statement";
import { Token } from "../token";
import tokenTypes from "../token-types";
import { ParserError } from "./parser-error";

export class Parser {
    tokens: Token[];
    errors: ParserError[];

    actual: number;

    constructor() {
        this.errors = [];
        this.tokens = [];
        this.actual = 0;
    }

    private checkActualTokenType(_type: string) {
        if (this.actual >= this.tokens.length) return false;
        return this.tokens[this.actual]._type === _type;
    }

    private consume(_type: string, errorMessage: string) {
        if (this.checkActualTokenType(_type)) return this.nextAndReturnPrevious();
        throw this.error(this.tokens[this.actual], errorMessage);
    }

    private error(token: Token, errorMessage: string): ParserError {
        const _exception = new ParserError(token, errorMessage);
        this.errors.push(_exception);
        return _exception;
    }

    /**
     * Checks whether the actual token has the type equal to any of the arguments.
     * If yes, advances the token counter.
     * @param args All the possible types.
     * @returns True if token is equal to one of the types; false otherwise.
     */
    private match(...args: string[]) {
        for (let i = 0; i < args.length; i++) { 
            const tipoAtual = args[i];
            if (this.checkActualTokenType(tipoAtual)) {
                this.nextAndReturnPrevious();
                return true;
            }
        }

        return false;
    }

    private nextAndReturnPrevious() {
        if (this.actual < this.tokens.length) this.actual += 1;
        return this.tokens[this.actual - 1];
    }

    private assignStatement(): any {
        const assignToken = this.nextAndReturnPrevious();
        return new Assign(assignToken.line);
    }

    private axiomStatement(): Axiom {
        const axiomToken = this.nextAndReturnPrevious();

        const definitionToken = this.consume(tokenTypes.IDENTIFIER, `Expected an identifier for concept definition.`);
        this.consume(tokenTypes.IS, `Expected "is" keyword after identifier for concept definition.`)
        this.consume(tokenTypes.INDEFINITE_ARTICLE, `Expected an indefinite article after "is" for concept definition.`);

        const axiomDefinedByToken = this.consume(tokenTypes.IDENTIFIER, `Expected a second identifier after the second indefinite article for concept definition.`);
        this.consume(tokenTypes.PERIOD, `Expected period to end a concept definition.`);

        return new Axiom(
            axiomToken.line,
            definitionToken,
            axiomDefinedByToken
        );
    }

    private convertStatement(): Convert {
        const convertToken = this.nextAndReturnPrevious();
        return new Convert(convertToken.line);
    }

    private resolveStatement(): any {
        switch (this.tokens[this.actual]._type) {
            case tokenTypes.ASSIGN:
                return this.assignStatement();
            case tokenTypes.CONVERT:
                return this.convertStatement();
            case tokenTypes.INDEFINITE_ARTICLE:
                return this.axiomStatement();
            case tokenTypes.WRITE:
            default:
                this.nextAndReturnPrevious();
                break;
        }
    }

    parse(tokens: Token[]) {
        this.errors = [];
        this.actual = 0;

        this.tokens = tokens || [];
        let statements: Statement[] = [];

        while (this.actual < this.tokens.length) {
            statements.push(this.resolveStatement());
        }

        return statements;
    }
}