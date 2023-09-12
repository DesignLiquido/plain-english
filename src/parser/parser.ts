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
        return new Axiom(axiomToken.line);
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