const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async() => {
    // initialize server
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });

    // register server routes
    server.route(routes);

    // start server
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();
