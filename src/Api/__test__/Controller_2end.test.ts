import Controller from "../Controller";

describe('Controller to end tests', () => {
    it('can request data from APIs using a config', async () => {
        const controller = new Controller();
        await controller.init();
        const result = await controller.getUWData({
            //https://www.latlong.net/place/belfast-uk-2141.html
            latitude: 54.607868,
            longitude: -5.926437,
            days: 7
        });
        expect(result.data.length).toEqual(2);
    })
});