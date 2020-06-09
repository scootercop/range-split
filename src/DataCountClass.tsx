
export class DataCount {
    total: number;
    used: number;
    unUsed: number;
    constructor(total: number) {
        this.total = total;
        this.used = 0;
        this.unUsed = total;
    }
}