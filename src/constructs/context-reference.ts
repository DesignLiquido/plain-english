import { CommonVisitorInterface } from "../interfaces/common-visitor-interface";
import { Token } from "../token";
import { Construct } from "./construct";

export class ContextReference extends Construct {
    conceptReference: Token;
    concept: Token;
    _type?: Token;

    constructor(line: number, conceptReference: Token, concept: Token, _type?: Token) {
        super(line);
        this.conceptReference = conceptReference;
        this.concept = concept;
        this._type = _type;
    }
    
    accept(visitor: CommonVisitorInterface): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
