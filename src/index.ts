require('dotenv').config();

import BranchingEdge from './classes/basic/BranchingEdge';
import MatrixElement from './classes/basic/MatrixElement';
import Node from './classes/basic/Node';
import ReducedMatrix from './classes/basic/ReducedMatrix';

import BranchAndBoundBasic from './classes/BranchAndBoundBasic';

// let inf = Infinity;
// let sourceMatrix_1: Array<Array<number>> = [
//     [inf,      88,       32,       72,       81 ],
//     [39,       inf,      46,       80,       22 ],
//     [9,        70,       inf,      81,       78 ],
//     [2,        32,       29,       inf,      48 ],
//     [69,       68,       47,       61,       inf]
// ];

// let sourceMatrix_2: Array<Array<number>> = [
//     [inf,      96,       33,       24,       12 ],
//     [36,       inf,      25,       33,       44 ],
//     [58,       67,       inf,      52,       12 ],
//     [36,       65,       42,       inf,      33 ],
//     [66,       58,       47,       55,       inf]
// ];

// console.log(JSON.stringify(sourceMatrix_1));
// console.log(JSON.stringify(sourceMatrix_2));

/*
    Ответ: путь: 1 => 4 => 2 => 5 => 3 => 1 длина: 182
*/

// let branchAndBoundBasic_1 = new BranchAndBoundBasic(sourceMatrix_1, 5);
// console.log(branchAndBoundBasic_1.getRoute(2));

// let branchAndBoundBasic_2 = new BranchAndBoundBasic(sourceMatrix_2, 5);
// console.log(branchAndBoundBasic_2.getRoute(3));


require('dotenv').config();
import { MainServer } from './MainServer';

new MainServer().start(Number(process.env.PORT || 3000));

