export class PaginationInfo{
    Count: number | undefined;
    PageSize: number | undefined;
    PageNumber: number | undefined;
    PageCount: number | undefined;
    TotalItemCount: number | undefined;
    HasNextPage: boolean | undefined;
    HasPreviousPage: boolean | undefined;

    constructor() {}

    /*constructor(Count: number,
        PageSize: number,
        PageCount: number,
        TotalItemCount: number,
        HasNextPage: boolean,
        HasPreviousPage: boolean)
    {
        this.Count = Count;
        this.PageSize = PageSize;
        this.PageCount = PageCount;
        this.TotalItemCount = TotalItemCount;
        this.HasNextPage = HasNextPage;
        this.HasPreviousPage = HasPreviousPage;
    }*/
}