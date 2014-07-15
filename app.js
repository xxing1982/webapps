var getApp = function (config) {
    var express = require('express');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var errorHandler = require('errorhandler');
    var methodOverride = require('method-override');

    //routers can be thought of as "mini" applications only capable of performing middleware and routing.
    var router = express.Router();

    //app to return
    var app = module.exports = express();

    //Application local variables are provided to all templates rendered within the application.
    app.locals.real_time_server = config.server.production.real_time_server;

    //extension is html instead of ejs
    app.engine('.html', require('ejs').__express);
    //set views path
    app.set('views', __dirname + '/views');
    //the extension is NOT needed in res.render
    app.set('view engine', 'html');

    //middleware declaration
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(express.static(__dirname + '/public'));

    //error handling for development only
    if ('development' == app.get('env')) {
        app.use(errorHandler({ dumpExceptions: true, showStack: true }));
    }
    //error handling for production only
    if ('production' == app.get('env')) {
        app.use(errorHandler());
    }

    //only requests to /routes/* will be sent to router
    app.use('/routes', router);

    //router to configure app view
	require('./routes/index').configure(app);

	return app;
};

exports.getApp = getApp;
