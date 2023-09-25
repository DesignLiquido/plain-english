import { Construct } from "../constructs/construct";
import { ContextReference } from "../constructs/context-reference";
import { Literal } from "../constructs/literal";
import { Assign } from "../statements/assign";
import { Axiom } from "../statements/axiom";
import { Convert } from "../statements/convert";
import { Statement } from "../statements/statement";
import { Write } from "../statements/write";
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

    private contextReferenceWithQualifier(operation: string, referenceTargetToken: Token, targetToken: Token) {
        switch (this.tokens[this.actual].lexeme.toLowerCase()) {
            case 'decimal':
            case 'hexadecimal':
                const tipoQualificador = this.nextAndReturnPrevious();
                return new ContextReference(
                    targetToken.line, 
                    referenceTargetToken,
                    targetToken,
                    tipoQualificador
                );
            default:
                throw this.error(this.tokens[this.actual], `Invalid data type for ${operation} target: ${this.tokens[this.actual].lexeme}.`);
        }
    }

    private assignThroughLiteral(startToken: Token) {
        const identifierOrLiteral = this.nextAndReturnPrevious();
        const value = new Literal(identifierOrLiteral);

        this.consume(tokenTypes.TO, "Expected a 'to' keyword after literal or identifier in 'Assign' statement.");
        const assignReferenceTarget = this.consume(tokenTypes.INDEFINITE_ARTICLE, 
            "Expected an article after keyword 'to' in 'Assign' statement.");

        const assignTargetToken = this.nextAndReturnPrevious();
        let assignTarget;
        if (this.tokens[this.actual]._type === tokenTypes.IDENTIFIER) {
            assignTarget = this.contextReferenceWithQualifier("Assign", assignReferenceTarget, assignTargetToken);
        } else {
            assignTarget = new ContextReference(assignTargetToken.line, assignReferenceTarget, assignTargetToken);
        }

        this.consume(tokenTypes.PERIOD, "Expected period to finalize 'Assign' expression.");

        return new Assign(
            startToken.line,
            value,
            assignTarget
        )
    }

    private assignStatement(): any {
        const assignToken = this.nextAndReturnPrevious();

        switch (this.tokens[this.actual]._type) {
            case tokenTypes.HEX:
            case tokenTypes.NUMBER:
            case tokenTypes.TEXT:
                return this.assignThroughLiteral(assignToken);
            case tokenTypes.DEFINITE_ARTICLE:
                const conceptReference = this.nextAndReturnPrevious();
                const concept = this.nextAndReturnPrevious();
                const value = new ContextReference(
                    assignToken.line,
                    conceptReference,
                    concept
                );

                this.consume(tokenTypes.TO, `Expected keyword "to" after literal or identifier in "Assign" statement.`);
                if (!this.match(tokenTypes.DEFINITE_ARTICLE, tokenTypes.INDEFINITE_ARTICLE)) {
                    throw this.error(this.tokens[this.actual], `Expected an article after keyword "to" in "Assign" statement.`);
                }

                const secondConceptReference = this.nextAndReturnPrevious();
                const secondConcept = new ContextReference(
                    secondConceptReference.line,
                    secondConceptReference,
                    secondConceptReference
                );

                this.consume(tokenTypes.PERIOD, `Expected period to finalize "Assign" statement.`);

                return new Assign(
                    assignToken.line,
                    value,
                    secondConcept
                );
        }
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

    private writeStatement(): Write {
        const writeToken = this.nextAndReturnPrevious();

        let argumentConstruct: Construct;
        switch (this.tokens[this.actual]._type) {
            case tokenTypes.TEXT:
                const identifierOrLiteralToken = this.nextAndReturnPrevious();
                argumentConstruct = new Literal(identifierOrLiteralToken);
                break;
            case tokenTypes.DEFINITE_ARTICLE:
                const conceptReference = this.nextAndReturnPrevious();
                const concept = this.nextAndReturnPrevious();

                if (this.match(tokenTypes.IDENTIFIER)) {
                    argumentConstruct = this.contextReferenceWithQualifier("Cast", conceptReference, concept);
                } else {
                    argumentConstruct = new ContextReference(
                        writeToken.line,
                        conceptReference,
                        concept
                    );
                }

                break;
            default:
                throw this.error(this.tokens[this.actual], `Expected a text literal after "Write" keyword.`);
        }

        this.consume(tokenTypes.PERIOD, `Expected period to end a write command.`);
        return new Write(
            writeToken.line, [
                argumentConstruct
            ]);
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
                return this.writeStatement();
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