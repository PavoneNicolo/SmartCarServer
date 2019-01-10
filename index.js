const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org');
const config = require('./config');
const process = require('./data_process/influx_utility.js');
const db = config.influxConfig('localhost', 'cars_data', 8086);

client.on('connect', function () {
    client.subscribe('kitt/cars/+/temperature1');
    client.subscribe('kitt/cars/+/speed1');
    client.subscribe('kitt/cars/+/GPS/lat1');
    client.subscribe('kitt/cars/+/GPS/lon1');
});

client.on('message', function (topic, message) {
    let body = JSON.parse(message.toString());
    console.log(message.toString());
    let split_topic = topic.split("/");
    let measure_type = split_topic[split_topic.length - 1];
    let carID = split_topic[2];
    let field = {
        "fldName": measure_type,
        "value": body.value
    };
	
    //This data format follows writeInflux() specifications
    let data = {
        vinNumber: carID,
        fields: [field],
        Timestamp: body.timestamp
    };

    try {
        process.writeInflux(db, data);
    }
    catch (e) {
        console.log("Errore scrittura su InfluxDB");
    }
});