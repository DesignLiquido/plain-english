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
        it('"An amount is a number."', () => {
            const lexerResult = lexer.tokenize(["An amount is a number."]);
            const result = parser.parse(lexerResult.tokens);
            
            expect(result).toBeTruthy();
            expect(result).toHaveLength(1);
        });

        it('"Write "123"."', () => {
            const lexerResult = lexer.tokenize(['Write "123".']);
            const result = parser.parse(lexerResult.tokens);
            
            expect(result).toBeTruthy();
            expect(result).toHaveLength(1);
        });

        it('"Assign "123" to a string. Write the string."', () => {
            const lexerResult = lexer.tokenize([
                'Assign "123" to a string.',
                'Write the string.'
            ]);

            const result = parser.parse(lexerResult.tokens);
            
            expect(result).toBeTruthy();
            expect(result).toHaveLength(2);
        });

        it('"Assign 1 to a number. Assign the number to a count."', () => {
            const lexerResult = lexer.tokenize([
                'Assign 1 to a number.',
                'Assign the number to a count.'
            ]);

            const result = parser.parse(lexerResult.tokens);

            expect(result).toBeTruthy();
            expect(result).toHaveLength(2);
        });
    });
});