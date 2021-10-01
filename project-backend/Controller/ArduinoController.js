const SerialPort = require('serialport');
const childProcess = require('child_process')

class ArduinoController {
    getData = async (request, response, next) => {
        const arduinoConnection = await this.getArduinoConnection();

        const [dataHeaders, dataGathered] = await this.readDataFromArduino(arduinoConnection, 2);

        const finalDataResponse = this.arrangeData(dataHeaders, dataGathered);

        const modelTrainingData = [finalDataResponse.Voltage_drop, finalDataResponse.R_Soil, finalDataResponse['EC-mS/cm'], finalDataResponse.Temperature, finalDataResponse.pH];

        const finalData = { ...finalDataResponse, ...(await this.predictDataFromModel(modelTrainingData)) };

        return response.json(finalData);
    }

    getArduinoConnection = () => {
        const [arduinoPort, baudRate] = ['COM5', 9600];

        return new Promise((resolve, reject) => {
            const arduinoConnection = new SerialPort(arduinoPort, { baudRate }, (error) => {
                if (error) {
                    return reject(error);
                }
            });

            return resolve(arduinoConnection);
        });
    }

    readDataFromArduino = (arduinoConnection, samplesRequired) => {
        return new Promise((resolve, reject) => {
            let data = '';

            arduinoConnection.read();

            arduinoConnection.on('data', (dataReceived) => {
                if (dataReceived.length > 0) {
                    data += dataReceived;

                    let dataReceivedTillYet = data.split(/\r?\n/).filter((receivedRawData) => !!receivedRawData);

                    if (dataReceivedTillYet.length === samplesRequired + 2) {
                        arduinoConnection.close();
                        return resolve([dataReceivedTillYet[0], dataReceivedTillYet.slice(1, samplesRequired + 1)]);
                    }
                }
            });
        });
    }

    arrangeData = (dataHeaders, dataGathered) => {
        dataHeaders = dataHeaders.split(',');

        dataGathered = dataGathered.map((eachDataRow) => {
            return eachDataRow.split(',').map((eachDataPiece, index) => {
                if (index === 5) {
                    return Number(eachDataPiece.slice(0, eachDataPiece.length - 1));
                }

                return +eachDataPiece;
            });
        });

        const initialAveragedData = Array(6).fill(0);

        for (let headerIndex = 0; headerIndex < dataHeaders.length; headerIndex++) {
            for (let rowIndex = 0; rowIndex < dataGathered.length; rowIndex++) {
                initialAveragedData[headerIndex] += dataGathered[rowIndex][headerIndex];
            }
        }

        for (let headerIndex = 0; headerIndex < dataHeaders.length; headerIndex++) {
            initialAveragedData[headerIndex] = initialAveragedData[headerIndex] / dataGathered.length;
        }

        const averagedDataObject = {};

        for (let headerIndex = 0; headerIndex < dataHeaders.length; headerIndex++) {
            averagedDataObject[dataHeaders[headerIndex]] = initialAveragedData[headerIndex];
        }

        return averagedDataObject;
    }

    predictDataFromModel = (inputData) => {
        console.log('In JS start')
        return new Promise((resolve, reject) => {
            const pythonProcess = childProcess.spawn(
                'E:\\Anaconda\\envs\\FYP\\python.exe',
                [
                    'C:\\Users\\Huzaifa Sohail\\OneDrive\\Desktop\\Project UI\\project-backend\\model.py',
                    inputData[0],
                    inputData[1],
                    inputData[2],
                    inputData[3],
                    inputData[4],
                ]
            );

            pythonProcess.stdout.on('data', data => {
                const dataReceived = data.toString();

                if (dataReceived.includes('[') && dataReceived.includes(']')) {
                    const result = dataReceived.substring(
                        dataReceived.indexOf('[') + 1, dataReceived.indexOf(']')
                    );

                    data = result.split(', ').map(res => Number(res));
                    return resolve({ nitrogen: data[0], phosphorus: data[1], potassium: data[2] });
                }
            })
        });
    }
}

module.exports = new ArduinoController();