import { CommonVisitorInterface } from "../interfaces/common-visitor-interface";
import { Token } from "../token";
import { Statement } from "./statement";

export class Axiom extends Statement {
    definitionToken: Token;
    previousAxiomToken: Token;

    constructor(line: number, definitionToken: Token, previousAxiomToken: Token) {
        super(line);
        this.definitionToken = definitionToken;
        this.previousAxiomToken = previousAxiomToken;
    }

    accept(visitor: CommonVisitorInterface): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
