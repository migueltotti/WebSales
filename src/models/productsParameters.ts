import { QueryStringParameters } from "./queryStringParameters";

export class ProductParameters{
    name: string;
    value: number | null = null;
    priceCriteria: string;
    typeValue: string;
    queryString: QueryStringParameters | null = null;

    constructor(
        name: string,
        value: number | null,
        priceCriteria: string,
        typeValue: string,
    ){
        this.name = name;
        this.value = value;
        this.priceCriteria = priceCriteria;
        this.typeValue = typeValue;
    }
}