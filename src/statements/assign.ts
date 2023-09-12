import { CommonVisitorInterface } from "../interfaces/common-visitor-interface";
import { Statement } from "./statement";

export class Assign extends Statement {
    accept(visitor: CommonVisitorInterface): Promise<any> {
        throw new Error("Method not implemented.");
    }
}