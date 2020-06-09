
import { DataRange } from "./DataRangeClass";
import { RangePair } from "./RangePairClass";

export class RangeInput extends DataRange {
    error?: Error;
    total: number | undefined;;
    valid: boolean;
    constructor(data: number[] | undefined, range: RangePair | undefined) {
        super(data, range);
        this.valid = true;
        this.total = this.last && this.first ? this.last - this.first + 1 : undefined;
    }
}