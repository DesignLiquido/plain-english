import { Construct } from "../constructs/construct";
import { CommonVisitorInterface } from "../interfaces/common-visitor-interface";
import { Token } from "../token";
import { Statement } from "./statement";

export class Assign extends Statement {
    name?: Token;
    value: Construct;
    targetConcept: Construct;

    constructor(line: number, value: Construct, targetConcept: Construct) {
        super(line);
        this.value = value;
        this.targetConcept = targetConcept;
    }

    accept(visitor: CommonVisitorInterface): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
