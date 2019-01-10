const restify = require('restify');
const server = restify.createServer({name: "API version 1"});
const httpRoute = require('./api/v1/index.js');

httpRoute.applyRoutes(server, '/v1');

server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
    console.log('%s listening at localhost', server.name);
});