import { Request, Response } from 'express';
import { Controller, Get, Post, Put, Middleware } from '@overnightjs/core';

//Configs
import Log4js from '../config/Log4js';
import Handlebars from 'handlebars';
import fs from 'fs';
import BranchAndBoundBasic from '../classes/BranchAndBoundBasic';

@Controller('')
export default class ServiceController {

    private logger: any;

    constructor() {
        this.logger = Log4js.getLogger('main');
    }

    @Post('api/bab/basic')
    private async branchAndBoundBasic(req: Request, res: Response) {
        try {
            let { matrix, start } = req.body;
            console.log(req.body);
            let checkedMatrix = matrix.map((row: Array<number>) => {
                return [
                    ...row.map((cell) => {
                        return cell || Infinity;
                    })
                ];
            });
            
            let branchAndBoundBasic_1 = new BranchAndBoundBasic(checkedMatrix, checkedMatrix.length);       
            let result = branchAndBoundBasic_1.getRoute(start);
            this.logger.info(`The result was calculated in ${result.time} ms`);
            res.json(result);
        } catch (e) {
            res.json({
                success: false,
                message: e.getMessage()
            })
        }
    }
}