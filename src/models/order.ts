import { Product } from "./product";

export class Order{
    orderId!: number;
    totalValue!: number;
    orderDate!: string;
    orderStatus!: number;
    userId!: number;
    products!: Product[];

    constructor(
        orderId: number,
        totalValue: number,
        orderDate: string,
        orderStatus: number,
        userId: number,
        products: Product[]
    ) {
        this.orderId = orderId;
        this.totalValue = totalValue;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.userId = userId;
        this.products = products;
    }
}