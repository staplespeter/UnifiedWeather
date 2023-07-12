import express from 'express';
import Controller from './Controller';


type UWRequest = express.Request<{}, UW.Result, UW.QueryParams, UW.QueryParams>;
type UWResponse = express.Response<UW.Result>

export default class Routes {
    private static controller: Controller = null;

    static async getRoutes(): Promise<express.Router> {
        if (!Routes.controller) {
            Routes.controller = new Controller();
            await Routes.controller.init();
        }

        const router = express.Router();
        router.use(express.json());

        //todo
        // router.get('/:lat/:long', async (req, res) => {

        // });
        router.get('/', async (req: UWRequest, res: UWResponse) => {
            let result: UW.Result = null;
            res.type('appplication.json');

            if (!req.query || Object.keys(req.query).length == 0 ) {
                result = {
                    error : 'No data found'
                }
                res.status(400).send(result);
                return;
            }
            result = await Routes.controller.getUWData(req.query);
            if (result.error) {
                res.status(500).send(result);
                return;
            }
            res.status(201).send(result);
        });
        router.post('/', async (req: UWRequest, res: UWResponse) => {
            let result: UW.Result = null;
            res.type('appplication.json');

            if (!req.body || Object.keys(req.body).length == 0 ) {
                result = {
                    error: 'No data found'
                }
                res.status(400).send(result);
                return;
            }
            result = await Routes.controller.getUWData(req.body);
            if (result.error) {
                res.status(500).send(result);
                return;
            }
            res.status(201).send(result);
        });

        return router;
    }
}