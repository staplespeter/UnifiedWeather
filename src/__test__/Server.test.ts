import Server from '../Server';
import axios from 'axios';
jest.unmock('axios');


describe('Server API live data tests', () => {
    let s: Server;

    beforeAll(async () => {
        s = new Server();
        await s.start();
    });

    afterAll(async () => {
        await s.stop();
    });

    it('can aggregate data from weather forecast services', async () => {
        const days = 5;

        const options = {
            method: 'GET',
            url: 'http://localhost:25025/uw/',
            params: {
                latitude: 54.607868,
                longitude: -5.926437,
                days: days
            }
        };
        const response = await axios.request(options);
        expect(response.status).toEqual(200);
        expect(response.data.weatherData.length).toEqual(days * 24);
    });
});