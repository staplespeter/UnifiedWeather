import express from 'express';
import Controller from './Controller';

/** UW specific express request */
type UWRequest = express.Request<{}, UW.Result, UW.QueryParams, UW.QueryParams>;
/** UW specific express response */
type UWResponse = express.Response<UW.Result>

/**
 * Assigns express routing methods for handling HTTP request and response.
 */
export default class Routes {
    private static controller: Controller = null;

    /**
     * Assigns express routing methods for handling HTTP request and response. 
     * @returns {express.Router} The express routing object containing the methods.
     */
    static async getRoutes(): Promise<express.Router> {
        if (!Routes.controller) {
            Routes.controller = new Controller();
            await Routes.controller.init();
        }

        const router = express.Router();
        router.use(express.json());

        //todo: RESTful handler.
        // router.get('/:lat/:long', async (req, res) => {

        // });
        //Standard GET method handler 
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
            res.status(200).send(result);
        });
        //Standard POST handler
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
            res.status(200).send(result);
        });

        return router;
    }
}