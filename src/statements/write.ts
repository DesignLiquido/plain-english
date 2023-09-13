import { Construct } from "../constructs/construct";
import { CommonVisitorInterface } from "../interfaces/common-visitor-interface";
import { Statement } from "./statement";

export class Write extends Statement {
    args: Construct[];

    constructor(line: number, args: Construct[]) {
        super(line);
        this.args = args;
    }

    accept(visitor: CommonVisitorInterface): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
