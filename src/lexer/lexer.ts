import reservedWords from "../reserved-words";
import { Token } from "../token";
import tokenTypes from "../token-types";
import { LexerError } from "./lexer-error";

export class Lexer {
    code: string[];
    tokens: Token[];
    errors: LexerError[];
    line: number;
    actual: number;
    tokenStart: number;

    constructor() {
        this.code = [];
        this.errors = [];
        this.tokens = [];
        this.line = 0;
    }

    private isAlphabetCharacter(char: string) {
        return (
            (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z')
        );
    }

    private isBase10Digit(char: string) {
        return char >= '0' && char <= '9';
    }

    private isBase16Digit(char: string) {
        return char >= '0' && char <= 'F';
    }

    private isAlphabetOrDigit(char: string) {
        return this.isBase10Digit(char) || this.isAlphabetCharacter(char);
    }

    private isEndOfLine(): boolean {
        if (this.code.length === this.line) {
            return true;
        }
        return this.actual >= this.code[this.line].length;
    }

    private isLastLine() {
        return this.line >= this.code.length - 1;
    }

    private isEndOfCode() {
        return this.isLastLine() && this.code[this.code.length - 1].length <= this.actual;
    }

    private addToken(_type: string, literal: any = null) {
        const text: string = this.code[this.line].substring(this.tokenStart, this.actual);
        this.tokens.push(new Token(_type, literal || text, literal, this.line + 1));
    }

    private identifyKeyword(): void {
        while (this.isAlphabetOrDigit(this.code[this.line][this.actual])) {
            this.next();
        }

        const keyword: string = this.code[this.line].substring(this.tokenStart, this.actual).toLowerCase();
        const _type: string = keyword in reservedWords ? reservedWords[keyword] : tokenTypes.IDENTIFIER;

        this.addToken(_type);
    }

    private next(): void {
        this.actual += 1;
        if (this.isEndOfLine() && !this.isEndOfCode()) {
            this.line++;
            this.actual = 0;
        }
    }

    private parseBase10Number() {
        while (this.isBase10Digit(this.code[this.line][this.actual])) {
            this.next();
        }

        if (this.code[this.line][this.actual] == '.' && this.isBase10Digit(this.code[this.line][this.actual + 1])) {
            this.next();

            while (this.isBase10Digit(this.code[this.line][this.actual])) {
                this.next();
            }
        }

        const numeroCompleto = this.code[this.line].substring(this.tokenStart, this.actual);

        this.addToken(tokenTypes.NUMBER, parseFloat(numeroCompleto));
    }

    private parseText(delimiter = '"'): void {
        while (this.code[this.line][this.actual] !== delimiter && !this.isEndOfCode()) {
            this.next();
        }

        if (this.isEndOfCode()) {
            this.errors.push({
                line: this.line + 1,
                char: this.code[this.line][this.actual - 1],
                message: 'Unfinalized text.',
            } as LexerError);
            return;
        }

        const value = this.code[this.line].substring(this.tokenStart + 1, this.actual);
        this.addToken(tokenTypes.TEXT, value);
    }

    private resolveActualCharacter() {
        const char = this.code[this.line][this.actual];

        switch (char) {
            case '.':
                this.addToken(tokenTypes.PERIOD);
                this.next();
                break;
            case ',':
                this.addToken(tokenTypes.COMMA);
                this.next();
                break;
            case ';':
                this.addToken(tokenTypes.SEMICOLON);
                this.next();
                break;
            case '/':
                this.addToken(tokenTypes.FORWARDSLASH);
                this.next();
                break;
            case '"':
                this.next();
                this.parseText('"');
                this.next();
                break;
            // Ignored tokens
            case ' ':
            case '\0':
            case '\r':
            case '\t':
            case '\n':
                this.next();
                break;
            default:
                if (this.isBase10Digit(char)) {
                    this.parseBase10Number();
                } else if (this.isAlphabetCharacter(char)) { 
                    this.identifyKeyword();
                }
                else {
                    this.errors.push({
                        line: this.line + 1,
                        char: char,
                        message: 'Unexpected character.',
                    } as LexerError);
                    this.next();
                }
        }
    }

    tokenize(code: string[]) {
        this.code = code;
        this.errors = [];
        this.actual = 0;
        this.line = 0;

        while (!this.isEndOfCode()) {
            this.tokenStart = this.actual;
            this.resolveActualCharacter();
        }

        return { 
            tokens: this.tokens,
            errors: this.errors
        };
    }
}