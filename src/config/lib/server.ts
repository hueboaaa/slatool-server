import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import logger from 'morgan';
import chalk from 'chalk';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';

import config from '../config';
import db from './db';

import coreRoute from '../../routes/core';
import squenceRoute from '../../routes/sequence';
import bodyParser from 'body-parser';
 

/**
 * Express server
 */
export class Server {
  app: Application;

  constructor() {
    this.app = express();

    if (this.app) {
      this.init();
    }
  }

  private init() {
    this.initLocalVariables();
    this.initMiddleware();
    // this.init404ErrorRoute();
    this.initServerRoute();
    this.initErrorRoute();
  }

  /**
   * Initialize local variables
   */
  initLocalVariables() {
    // this.app.locals.favicon = config.favicon
    this.app.locals.env = process.env.NODE_ENV;
  }

  private initServerRoute() {
    coreRoute(this.app);
    squenceRoute(this.app);
  }

  /**
   * Initialize middlewares
   */
  private initMiddleware() {
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));

  }

  /**
   * Error handler
   */
  private initErrorRoute() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        // logger.err(err, true);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: err.message
        });
      }
    );
  }

  /**
   * catch 404 and forward to error handler
   */
  private init404ErrorRoute() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(createError(404));
    });
  }

  /**
   * Express start
   */
  start() {
    /**
     * Express server listen and start callback handler
     */
    const onListen = () => {
      console.log('--');
      console.log(chalk.white(`https://${config.domain}:${config.port}`));
      console.log('--');

      db.connect(function (err) {
        if (err) {
          console.error('Database connection failed: ' + err.stack);
          return;
        }

        console.log('Connected to database.');
      });

      // db.end();
    };

    this.app.listen(config.port, onListen);
  }
}

export default Server;
