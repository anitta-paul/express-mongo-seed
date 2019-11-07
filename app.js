let express = require('express'),
	path = require('path'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	compression = require('compression'),
	util = require('./utils'),
	routes = require('./routes/index'),
	app = express();
app.use(compression());

//comment below two lines to disable request logging
app.use(morgan('dev'));
app.use(require('morgan')('combined', { stream: util.logger.stream }));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.all('/*', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,platform');
	res.header('Version', 'ok');
	res.header('Authorized', 'true');
	next();
});
app.use('/api/', routes.api);

let http = require('http');
app.set('port', 3000);

/**
 * Create HTTP server.
 */
let server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

util.mongoUtil.connectToServer(function(err){
	//console.log(utils.encrypt.encryptTrackId('10'))
	if (err) console.log(err);
	else {
		server.listen(port, process.env.NODE_ENV == 'development' ? '0.0.0.0' : 'localhost');
	}
});

server.on('error', onError);
server.on('listening', onListening);

// catch 404 and forward to error handler
app.use(function(req, res, next){
	let err = new Error('Not Found');
	err.status = 404;
	next(err, req, res, next);
});

// error handlers

// development error handler
// will print stacktrace
//production do not use this.

function onError(error){
	if (error.syscall !== 'listen') {
		util.logger.log('error', error);
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(){
	let addr = server.address();
	let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('Listening on ' + bind);
}

module.exports = app;
