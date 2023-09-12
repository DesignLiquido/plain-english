import { Lexer } from "../src/lexer/lexer";
import { Parser } from "../src/parser/parser";

describe('Parser', () => {
    let lexer: Lexer;
    let parser: Parser;

    beforeEach(() => {
        lexer = new Lexer();
        parser = new Parser();
    });

    describe('parse()', () => {
        it("An amount is a number.", () => {
            const lexerResult = lexer.tokenize(["An amount is a number."]);
            const result = parser.parse(lexerResult.tokens);
            
            expect(lexerResult).toBeTruthy();
            expect(lexerResult.errors).toHaveLength(0);
            expect(lexerResult.tokens).toHaveLength(6);
        });
    });
});