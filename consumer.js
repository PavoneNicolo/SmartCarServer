require('dotenv').config();
const amqp = require('amqplib/callback_api');
const config = require('./config');
const data_process = require('./data_process/influx_utility');
const db = config.influxConfig('localhost','cars_data',8086);

//example of BROKER_URL = amqp://username:password@hostname
amqp.connect(process.env.BROKER_URL, function(err, conn) {
    conn.createChannel(function(err, ch) {
        let ex = 'kitt/cars';

        ch.assertExchange(ex, 'topic', {durable: false});

        ch.assertQueue('', {exclusive: true}, function(err, q) {
            console.log(' [*] Waiting for data. To exit press CTRL+C');

            ch.bindQueue(q.queue, ex, '*'); //serve all the cars at kitt/cars/:carID topic
            ch.consume(q.queue, function(msg) {
                let data = JSON.parse(msg.content.toString());
                data.vinNumber = msg.fields.routingKey;//routing key is the car ID
                try{
                    data_process.writeInflux(db, data);
                }
                catch (e) {
                    console.log('Can\'t write on InlfuxDB!');
                }
            }, {noAck: true});
        });
    });
});