import MatrixElement from './MatrixElement';

export default class BranchingEdge {
    sumCastConstants: number;
    element: MatrixElement;

    constructor(sumCastConstants: number, element: MatrixElement) {
        this.sumCastConstants = sumCastConstants;
        this.element = element;
    }
}