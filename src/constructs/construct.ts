import { CommonVisitorInterface } from "../interfaces/common-visitor-interface";

export abstract class Construct {
    line: number;

    constructor(line: number) {
        this.line = line;
    }

    abstract accept(visitor: CommonVisitorInterface): Promise<any>;
}
