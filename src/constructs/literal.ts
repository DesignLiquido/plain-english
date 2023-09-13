import { CommonVisitorInterface } from "../interfaces/common-visitor-interface";
import { Token } from "../token";
import { Construct } from "./construct";

export type Fraction = {
    numerator: number,
    denominator: number
}

export type HexNumber = {
    value: string
}

export type LiteralValue = number | string | number[] | string[] | Fraction | HexNumber | any;

export class Literal extends Construct {
    value: LiteralValue;

    constructor(literalToken: Token) {
        super(literalToken.line);
        this.value = literalToken.literal;
    }

    accept(visitor: CommonVisitorInterface): Promise<any> {
        throw new Error("Method not implemented.");
    }
}