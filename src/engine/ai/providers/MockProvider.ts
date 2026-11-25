import type {AIProvider,AIRequest} from './AIProvider';
export class MockProvider implements AIProvider {
 constructor(private readonly response:string){}
 async generate(_request:AIRequest):Promise<string>{return this.response;}
}
