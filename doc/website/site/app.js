//// app.js -- static demo site and irc-gateway server

require.paths.unshift(__dirname + '/../lib');

var sys = require('sys'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    Gateway = require('./gateway').Gateway;


/// --- Main Program

var DEFAULT_CONFIG = {
  staticRoot: path.join(__dirname, '../static'),
  webPort: 8192,
  webHost: '0.0.0.0',
  nick: 'webbot',
  ircHost: 'irc.freenode.net',
  ircPort: 6667,
  channels: ['#nodebot'],
  bufferSize: 45
};

/**
 * usage: node app.js
 *        node app.js port
 *        node app.js host port
 *
 * You may optionally specify a configuration file with the APP_CONFIG
 * environment variable.  The settings file should be in JSON format.
 */
(function(_, _, host, port) {
   if (!port) {
     port = host;
     host = null;
   }

   return start(configure(function(config) {
     if (host)
       config.host = host;
     if (port)
       config.port = parseInt(port);
   }));

}).apply(this, process.argv);

function configure(extra) {
  var config = extend({}, DEFAULT_CONFIG);
  if (process.env.APP_CONFIG)
    extend(config, JSON.parse(fs.readFileSync(process.env.APP_CONFIG)));
  return extra(config) || config;
}


/// --- HTTP

function start(config) {
  sys.puts('Starting <http://' + config.webHost + ':' + config.webPort + '/>.');
  http.createServer(server(config))
    .listen(config.webPort, config.webHost);
}

function server(config) {
  var gateway = (new Gateway(config)).open();

  function handle(req, res) {
    var parts = url.parse(req.url, true),
        query = parts.query;

    sys.log(req.method + ' ' + req.url);

    if (req.method != 'GET')
      error(res, 405, 'Method Not Allowed', { Allowed: 'GET' });
    else if (parts.pathname == '/irc-gateway')
      poll(res, number(query && query.since, -1));
    else if (parts.pathname == '/')
      file(res, '/index.html');
    else
      file(res, parts.pathname);
  }

  function poll(res, since) {
    gateway.recent(since, function(data) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(data));
    });
  }

  function file(res, pathname) {
    fs.readFile(path.join(config.staticRoot, pathname), function(err, data) {
      if (err) error(res, 404, 'Not Found');
      else {
        res.writeHead(200, {'Content-Type': mime(pathname)});
        res.end(data);
      }
    });
  }

  function error(res, code, reason, headers) {
    var message = code + ': ' + reason;
    res.writeHead(code, extend({'Content-Type': 'text/html'}, headers));
    res.end('<html><head><title>' + message + '</title></head>'
      + '<body><h1>' + message + '</h1></body></html>');
  }

  return handle;
}


/// --- Aux

function extend(target) {
  var key, obj;
  for (var i = 1, lim = arguments.length; i < lim; i++) {
    obj = arguments[i];
    if (!obj) continue;
    for (key in obj)
      target[key] = obj[key];
  }
  return target;
}

function number(val, otherwise) {
  var result = parseInt((val !== undefined) ? val : otherwise);
  return isNaN(result) ? otherwise : result;
}

function mime(pathname) {
  return MIME_TYPES[path.extname(pathname)] || 'text/html';
}

var MIME_TYPES = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png'
};
