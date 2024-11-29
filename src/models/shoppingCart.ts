import { Product } from "./product";
import { ProductChecked } from "./ProductChecked";

export class ShoppingCart{
    shoppingCartId!: number;
    totalValue!: number;
    productsCount!: number;
    userId!: number;
    products!: ProductChecked[]

    constructor(
        shoppingCartId: number,
        totalValue: number,
        productsCount: number,
        userId: number,
        products: ProductChecked[]
    ){
        this.shoppingCartId = shoppingCartId;
        this.totalValue = totalValue;
        this.productsCount = productsCount;
        this.userId = userId;
        this.products = products;
    }
}