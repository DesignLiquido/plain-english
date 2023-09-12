import { CommonVisitorInterface } from "../interfaces/common-visitor-interface";
import { Statement } from "./statement";

export class Convert extends Statement {
    accept(visitor: CommonVisitorInterface): Promise<any> {
        throw new Error("Method not implemented.");
    }
}