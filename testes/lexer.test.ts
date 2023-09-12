import { Lexer } from "../src/lexer/lexer";

describe('Lexer', () => {
    let lexer: Lexer;

    beforeEach(() => {
        lexer = new Lexer();
    });

    describe('Tokenize', () => {
        it("An amount is a number.", () => {
            const result = lexer.tokenize(["An amount is a number."]);
            expect(result).toBeTruthy();
            expect(result.errors).toHaveLength(0);
            expect(result.tokens).toHaveLength(6);
        });
    });
});
