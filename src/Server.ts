import express, { ErrorRequestHandler } from "express";
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import AuthRoutes from "./Api/Routes";
import winston from "winston";
import winstonDailyFileTransport from 'winston-daily-rotate-file';

export default class Server {
    private httpServer: http.Server;

    static readonly DEFAULT_HOSTNAME = 'localhost';
    static readonly DEFAULT_PORT = 25025;

    private _hostname: string;
    get hostname() {
        return this._hostname;
    }
    private _port: number;
    get port() {
        return this._port;
    }

    constructor();
    constructor(port: number);
    constructor(hostname: string, port: number);
    constructor(hostnameOrPort?: string | number, port?: number) {
        this._hostname = typeof(hostnameOrPort) === 'string' ?
            hostnameOrPort :
            process.env.API_HOSTNAME ?? Server.DEFAULT_HOSTNAME;
        this._port = typeof(hostnameOrPort) === 'number' ?
            hostnameOrPort :
            port ?? (!Number.isNaN(Number.parseInt(process.env.port ?? process.env.API_PORT)) ?
                Number.parseInt(process.env.port ?? process.env.API_PORT) :
                Server.DEFAULT_PORT);

        global.logger = winston.createLogger({
            transports: [
                new winston.transports.DailyRotateFile({
                    dirname: './logs/',
                    filename: '%DATE%.log',
                    maxFiles: '30d'
                })
            ],
            exceptionHandlers: [
                new winston.transports.DailyRotateFile({
                    dirname: './logs/',
                    filename: 'exceptions.%DATE%.log',
                    maxFiles: '30d'
                })
            ]
        });
        
        const expressApp = express();

        const corsOptions = {
            origin: true,
            methods: ['GET', 'POST'],
            optionsSuccessStatus: 200
        };
        expressApp.use(cors(corsOptions));        
        expressApp.use('/uw', AuthRoutes.getRoutes());
        
        expressApp.use((req, res, next) => {
            res.type('text/html');
            res.status(404).send('Requested route not found');
        });
        expressApp.use(function (err, req, res, next) {
            if (err) {
                res.type('text/html');
                res.status(400).send('Error: ' + err);
            }
            else {   
                next();
            }
        } as ErrorRequestHandler);

        this.httpServer = http.createServer(expressApp);
        this.httpServer.on('error', async (err) => {
            console.log('http server error: ' + err);
            await this.stop();
        });
    }

    start(): void {
        this.httpServer.listen({
            host: this._hostname,
            port: this._port
        },
        () => {
            console.log('http server started');
        });
    }

    async stop() {
        console.log('\nstopping http server');

        let closed = false;
        let iterations = 0;
        let p = new Promise((resolve, reject) => {
            let id = setInterval(() => {
                iterations++;
                if (closed) {
                    clearInterval(id);
                    resolve(closed);
                }
                else if (iterations == 10) {
                    clearInterval(id);
                    reject("http server stop timeout");
                }
            }, 500);
        });
        p.then(() => console.log('http server stopped'));
        p.catch((err) => console.log(err));

        this.httpServer.close(() => {
            closed = true;
        });
        await p;
    }
}
