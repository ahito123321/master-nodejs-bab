import MatrixElement from './MatrixElement';

export default class Node {
    public parent: Node;
    public left: Node;
    public right: Node;

    public basic: Array<Array<number>>;
    public bottomBorder: number;
    public point: MatrixElement;
    
    public sourceRowsIndexes: Array<number>;
    public sourceColumnIndexes: Array<number>;
}