export default class AveragingOptimiser implements UW.IDataOptimiser {
    optimise(data: Array<UW.Data[]>): UW.Data[] {
        //assume data is correctly aligned timewise.
        //assume null fields mean ignore that value.

        //check dimensions
        if (data.length == 0 || data[0].length == 0) {
            throw new Error('No data to optimise');
        }
        data.forEach(row => {
            if (row.length != data[0].length) {
                throw new Error('Data dimensions do not match');
            }
        });

        //set results to 0
        const result = new Array<UW.Data>(data[0].length);
        //count how many values used for each average
        const rowCount = new Array(data[0].length);
        for (let col = 0; col < data[0].length; col++) {
            result[col] = {
                latitude: data[0][col].latitude,
                longitude: data[0][col].longitude,
                utcTime: data[0][col].utcTime,
                temperature: 0,
                temperatureUnit: data[0][col].temperatureUnit,
                windSpeed: 0,
                windspeedUnit: data[0][col].windspeedUnit,
                windDirection: 0,
                precipitationChance: 0
            };
            rowCount[col] = {
                temperature: 0,
                windSpeed: 0,
                windDirection: 0,
                precipitationChance: 0
            }
        }
        for (let col = 0; col < data[0].length; col++) {
            for (let row = 0; row < data.length; row++) {
                if (data[row][col].temperature !== null) {
                    result[col].temperature = result[col].temperature + data[row][col].temperature;
                    rowCount[col].temperature++;
                }
                if (data[row][col].windSpeed !== null) {
                    result[col].windSpeed = result[col].windSpeed + data[row][col].windSpeed;
                    rowCount[col].windSpeed++;
                }
                if (data[row][col].windDirection !== null) {
                    result[col].windDirection = result[col].windDirection + data[row][col].windDirection;
                    rowCount[col].windDirection++;
                }
                if (data[row][col].precipitationChance !== null) {
                    result[col].precipitationChance = result[col].precipitationChance + data[row][col].precipitationChance;
                    rowCount[col].precipitationChance++;
                }
            }

            result[col].temperature = result[col].temperature / rowCount[col].temperature;
            result[col].windSpeed = result[col].windSpeed / rowCount[col].windSpeed;
            result[col].windDirection = result[col].windDirection / rowCount[col].windDirection;
            result[col].precipitationChance = result[col].precipitationChance / rowCount[col].precipitationChance;
        }

        return result;
    }
}