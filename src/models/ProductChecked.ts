import { Product } from "./product";

export class ProductChecked{
    product!: Product;
    checked!: boolean;
    amount!: number;
    
    constructor(product: Product,
        checked: boolean,
        amount: number
    ) {
        this.product = product;
        this.checked = checked;
        this.amount = amount;
    }
}