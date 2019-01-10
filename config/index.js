const influx = require('influx');

module.exports = {
    influxConfig: function (host, db, port) {
        return new influx.InfluxDB({
            host: host,
            database: db,
            port: port
        })
    }
};