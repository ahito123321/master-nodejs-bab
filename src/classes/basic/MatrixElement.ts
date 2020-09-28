export default class MatrixElement {
    public row: number;
    public column: number;

    constructor(row: number, col: number) {
        this.column = col;
        this.row = row;
    }

    public getNormolizeObject() {
        return { row: this.row++, column: this.column++ };
    }
}