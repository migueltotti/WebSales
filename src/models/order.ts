export class Order{
    orderId!: number;
    totalValue!: number;
    orderDate!: string;
    orderStatus!: number;
    userId!: number;

    constructor(
        orderId: number,
        totalValue: number,
        orderDate: string,
        orderStatus: number,
        userId: number
    ) {
        this.orderId = orderId;
        this.totalValue = totalValue;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.userId = userId;
    }
}