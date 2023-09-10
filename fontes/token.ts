export class Token {
    lexeme: string;
    _type: string;
    literal: any;
    line: number;

    constructor(_type: string, lexeme: string, literal: any, line: number) {
        this._type = _type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString(): string {
        return this._type + ' ' + this.lexeme + ' ' + this.literal;
    }
}
