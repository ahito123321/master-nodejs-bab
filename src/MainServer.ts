import express from 'express';
import { Server } from '@overnightjs/core';

//controllers
import ServiceController from './controllers/ServiceController';

import Log4js from './config/Log4js';

// Middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

export class MainServer extends Server {
    
    private logger: any;

    constructor() {
        super();
        this.logger = Log4js.getLogger('');
        this.setupExpress();
        super.addControllers(this.setupControllers());
    }
 
    private setupExpress(): void {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));
        this.app.use(cookieParser());
        this.app.use('/static', express.static('static'));
        this.app.use(cors());
        this.app.set('view engine', 'ejs');
    }
 
    private setupControllers(): Array<any> {
        let viewController = new ServiceController();
        return [
            viewController
        ];
    }

    public start(port: number) {
        this.app.listen(port, () => {
            this.logger.info(`Listening on port: ${port}`);
        });
    }
}