export default class ReducedMatrix {
    public sumCastConstants: number;
    public matrix: Array<Array<number>>;

    constructor(sumCastConstants: number, matrix: Array<Array<number>>) {
        this.sumCastConstants = sumCastConstants;
        this.matrix = matrix;
    }
}