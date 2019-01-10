const Router = require('restify-router').Router;
const router = new Router();
const config = require('./../../config');
const process = require('./../../data_process/influx_utility.js');
const db = config.influxConfig('localhost', 'cars_data', 8086);

//receive data from data collector and write into InfluxDB
router.post('/cars/:vinNumber/data', function (req, res, next) {
    let data = JSON.parse(req.body);
    data.vinNumber = req.params.vinNumber;

    try {
        process.writeInflux(db, data);
        res.send(200);
    }
    catch (e) {
        res.send(500);
    }

    return next();
});

module.exports = router;