
export class RangePair {
    swap() {
        let temp = this.left;
        this.left = this.right;
        this.right = temp;
    }
    left: number;
    right: number;
    constructor(left: number, right: number) {
        this.left = left;
        this.right = right;
    }
}