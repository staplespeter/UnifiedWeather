import express from 'express';
import Controller from './Controller';


type UWDataRequest = express.Request<{}, any,any, UW.QueryParams>;

export default class AuthRoutes {
    static getRoutes(): express.Router {
        const router = express.Router();
        router.use(express.json());

        //todo
        // router.get('/:lat/:long', async (req, res) => {

        // });
        router.get('/', async (req: UWDataRequest, res: express.Response, next: express.NextFunction) => {
            let result: UW.Result = null;
            res.type('appplication.json');

            if (!req.query || Object.keys(req.query).length == 0 ) {
                result = {
                    error : 'No data found'
                }
                res.status(400).send(result);
                return;
            }
            result = await Controller.getUWData({ latitude: req.query.latitude, longitude: req.query.longitude });
            if (result.error) {
                res.status(500).send(result);
                return;
            }
            res.status(201).send(result);
        });
        router.post('/', async (req, res) => {
            let result: UW.Result = null;
            res.type('appplication.json');

            if (!req.body || Object.keys(req.body).length == 0 ) {
                result = {
                    error: 'No data found'
                }
                res.status(400).send(result);
                return;
            }
            result = await Controller.getUWData({ latitude: req.body.latitude, longitude: req.body.longitude });
            if (result.error) {
                res.status(500).send(result);
                return;
            }
            res.status(201).send(result);
        });

        return router;
    }
}