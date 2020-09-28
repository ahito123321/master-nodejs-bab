import BranchingEdge from './basic/BranchingEdge';
import MatrixElement from './basic/MatrixElement';
import Node from './basic/Node';
import ReducedMatrix from './basic/ReducedMatrix';
import AlgorithmResult from './basic/AlgorithmResult';

export default class BranchAndBoundBasic {
    //исходная
    sourceMatrix: Array<Array<number>>;
    numberOfPoints: number;

    constructor(sourceMatrix: Array<Array<number>>, numberOfPoints: number) {
        this.sourceMatrix = sourceMatrix;
        this.numberOfPoints = numberOfPoints;
    }

    public getRoute(start: number): AlgorithmResult {
        let startTime = Date.now();
        let node: Node = new Node();
        node.basic = this.sourceMatrix.map(row => row.map(col => col));
        node.sourceRowsIndexes = [];
        node.sourceColumnIndexes = [];

        for (let index = 0; index < this.numberOfPoints; index++) {
            node.sourceRowsIndexes.push(index);
            node.sourceColumnIndexes.push(index);
        }

        let reducedMatrix: ReducedMatrix = this.reduceMatrix(node.basic);
        node.bottomBorder = reducedMatrix.sumCastConstants;
        let branchingEdge: BranchingEdge = this.defineBranchEdge(reducedMatrix.matrix);

        node.basic = reducedMatrix.matrix.map(row => row.map(col => col));
        node.right = this.include(node, branchingEdge);
        node.right.parent = node;
        node.left = this.exclude(node, branchingEdge);
        node.left.parent = node;
        let resultWeight = 0;

        while (node.basic.length !== 1) {
            
            if (node.right.bottomBorder > node.left.bottomBorder) {
                node = node.left;
            } else {
                node = node.right;
            }
            if (node.basic.length === 1) {
                resultWeight = node.bottomBorder;
                break;
            }
            branchingEdge = this.defineBranchEdge(node.basic);
            node.right = this.include(node, branchingEdge);
            node.right.parent = node;
            node.left = this.exclude(node, branchingEdge);
            node.left.parent = node;
        } 

        let resultRoute: Array<Array<number>> = [[
            node.sourceRowsIndexes[0] + 1,
            node.sourceColumnIndexes[0] + 1
        ]];
        while (node.parent !== undefined) {
            resultRoute.push([
                node.parent.sourceRowsIndexes[node.point.row] + 1,
                node.parent.sourceColumnIndexes[node.point.column] + 1
            ]);
            node = node.parent;
        }

        let endTime = Date.now();
        let result: AlgorithmResult = new AlgorithmResult();
        result.route = !start ? this.sort(resultRoute, 1) : this.sort(resultRoute, start);
        result.weight = resultWeight;
        result.time = endTime - startTime;

        return result;
    };

    public reduceMatrix(matrix: Array<Array<number>>): ReducedMatrix {
        let clonedMatrix: Array<Array<number>> = matrix.map(row => row.map(col => col));
        let minColumnElements: Array<number> = [];

        minColumnElements = this.getMinimumItems(clonedMatrix, true);

        for (let row = 0; row < clonedMatrix.length; row++) {
            for (let col = 0; col < clonedMatrix.length; col++) {
                clonedMatrix[row][col] -= minColumnElements[row];
            }
        }

        let minRowElements: Array<number> = [];

        minRowElements = this.getMinimumItems(clonedMatrix, false);

        for (let col = 0; col < clonedMatrix.length; col++) {
            for (let row = 0; row < clonedMatrix.length; row++) {
                clonedMatrix[row][col] -= minRowElements[col];
            }
        }

        let sum = minRowElements.reduce((acc, el) => el + acc, 0) + minColumnElements.reduce((acc, el) => el + acc, 0);

        return new ReducedMatrix(sum, clonedMatrix);
    }

    public getMinimumItems(matrix: Array<Array<number>>, isRow: boolean): Array<number> {
        let minElements: Array<number> = [];
        
        if (isRow) {
            for (let row = 0; row < matrix.length; row++) {
                let min = matrix[row][0];
    
                for (let col = 0; col < matrix.length; col++) {
                    min = Math.min(min, matrix[row][col]);
                }
                minElements.push(min);
            }
        } else {
            for (let col = 0; col < matrix.length; col++) {
                let min = matrix[0][col];
    
                for (let row = 0; row < matrix.length; row++) {
                    min = Math.min(min, matrix[row][col]);
                }
                minElements.push(min);
            }
        }

        return minElements;
    }

    public defineBranchEdge(matrix: Array<Array<number>>): BranchingEdge {
        let zeroIndexes: Array<MatrixElement> = [];

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                if (matrix[i][j] === 0) {
                    zeroIndexes.push(new MatrixElement(i, j));
                }
            }
        }

        let minZeroIndex: MatrixElement = new MatrixElement(0, 0);
        let sum = -Infinity;

        zeroIndexes.forEach((indexes: MatrixElement) => {

            let minRowEl: number = Infinity;
            for (let i = 0; i < matrix.length; i++) {
                if (i !== indexes.column) {
                    minRowEl = Math.min(matrix[indexes.row][i], minRowEl);
                }   
            }

            let minColumnEl: number = Infinity;
            for (let i = 0; i < matrix.length; i++) {
                if (i !== indexes.row) {
                    minColumnEl = Math.min(matrix[i][indexes.column], minColumnEl);
                }
            }

            if (sum < minRowEl + minColumnEl) {
                sum = minRowEl + minColumnEl;
                minZeroIndex.column = indexes.column;
                minZeroIndex.row = indexes.row;
            }
        });

        return new BranchingEdge(sum, minZeroIndex);
    }

    public include(node: Node, branchingEdge: BranchingEdge): Node {
        let rowIndex = node.sourceRowsIndexes[branchingEdge.element.row];
        let columnIndex = node.sourceColumnIndexes[branchingEdge.element.column];

        let reversedMatrixElement = new MatrixElement(node.sourceRowsIndexes.findIndex(el => columnIndex === el), 
            node.sourceColumnIndexes.findIndex(el => rowIndex === el));

        let newNode = new Node();
        let matrix = node.basic.map(row => row.map(col => col));

        if (reversedMatrixElement.row !== -1 && reversedMatrixElement.column !== -1) {
            matrix[reversedMatrixElement.row][reversedMatrixElement.column] = Infinity;
        }
        matrix.splice(branchingEdge.element.row, 1);

        for (let row = 0; row < matrix.length; row++) {
            matrix[row].splice(branchingEdge.element.column, 1);
        }

        let reducedMatrix = this.reduceMatrix(matrix);
        let tempSourceColumnIndexes = [... node.sourceColumnIndexes];
        tempSourceColumnIndexes.splice(branchingEdge.element.column, 1)
        let tempSourceRowsIndexes = [... node.sourceRowsIndexes];
        tempSourceRowsIndexes.splice(branchingEdge.element.row, 1)
        newNode.basic = reducedMatrix.matrix.map(row => row.map(col => col));
        newNode.point = branchingEdge.element;
        newNode.bottomBorder = node.bottomBorder + reducedMatrix.sumCastConstants;
        newNode.sourceColumnIndexes = tempSourceColumnIndexes;
        newNode.sourceRowsIndexes = tempSourceRowsIndexes;
        
        return newNode;
    }

    public exclude(node: Node, branchingEdge: BranchingEdge): Node {
        let matrix = [... node.basic];
        matrix[branchingEdge.element.row][branchingEdge.element.column] = Infinity;

        let reducedMatrix = this.reduceMatrix(matrix);
        let newNode = new Node();

        newNode.basic = reducedMatrix.matrix;
        newNode.point = branchingEdge.element;        
        newNode.bottomBorder = node.bottomBorder + reducedMatrix.sumCastConstants;
        newNode.sourceColumnIndexes = [... node.sourceColumnIndexes];
        newNode.sourceRowsIndexes = [... node.sourceRowsIndexes];

        return newNode;
    }

    public sort(routes: Array<Array<number>>, start: number): Array<Array<number>> {
        let sortedRoutes: Array<Array<number>> = [ routes.find(point => point[0] === start) ];

        for (let index = 0; index < routes.length - 1; index++) {
            sortedRoutes.push(routes.find(point => point[0] === sortedRoutes[index][1]));
        }

        return sortedRoutes;
    }
}