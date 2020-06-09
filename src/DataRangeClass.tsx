
import { RangePair } from "./RangePairClass";

export class DataRange {
    data: number[];
    first: number | undefined;
    last: number | undefined;
    constructor(data?: number[], range?: RangePair) {
        this.data = data || [];
        this.first = range ? range.left : undefined;
        this.last = range ? range.right : undefined;
    }
}