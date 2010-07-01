//// gateway -- read-only IRC -> Web gateway

require.paths.unshift(__dirname + '/../ext/Long-Polling-Buffer/lib');
require.paths.unshift(__dirname + '/../ext/nodebot/lib');

var sys = require('sys'),
    irc = require('irc'),
    bot = require('ircbot'),
    lpb = require('longpollingbuffer');

exports.Gateway = Gateway;


/// --- Long Polling

/**
 * A Gateway wraps an IRC client up into a long polling buffer.
 */
function Gateway(opt) {
  this.nick = opt.nick;
  this.host = opt.ircHost;
  this.port = opt.ircPort;
  this.channels = opt.channels;
  this.size = opt.bufferSize || 30;
}

Gateway.prototype.open = function() {
  var buffer = new lpb.LongPollingBuffer(this.size),
      client = connect(this.nick, this.host, this.port, this.channels, emit);

  this.buffer = buffer;
  this.client = client;

  function emit(data) {
    buffer.push(data);
  }

  return this;
};

Gateway.prototype.recent = function(since, callback) {
  this.buffer.addListenerForUpdateSince(parseInt(since), callback);
  return this;
};


/// --- IRC

/**
 * Connect to an IRC server and emit activity in the form:
 *
 *   { cmd: NAME, args: [arg1, arg2, ...] }
 */
function connect(nick, host, port, channels, emit) {
  var conn = irc.client({
    nick: nick,
    host: host,
    port: port,
    join: channels,

    ready: {
      connect: function() {
        log('Connected');
      },

      reconnect: function() {
        log('Reconnecting...');
      },

      close: function() {
        log('Client disconnected.  Goodbye');
      },

      message: function(msg) {
        if (typeof msg.command == 'number')
          sys.log(msg.command.toString() + ' ' + msg.params.slice(1).join(' '));
      },

      privmsg: function(msg, target, text) {
        message('<span class="who">#{1}:</span> #{2}', msg.nick, text);
        dispatch(conn, msg, target, text);
      },

      action: function(msg, target, text) {
        message('<span class="who">* #{1}</span> #{2}', msg.nick, text);
      },

      NOTICE: function(msg, target, text) {
        info('#{1}', text);
      },

      MODE: function(msg, nick, mode) {
        info('MODE changed for #{1} to #{2}', nick, mode);
      },

      JOIN: function(msg, channel) {
        activity(this, msg, 'joined', channel);
      },

      PART: function(msg, channel) {
        activity(this, msg, 'left', channel);
      },

      QUIT: function(msg, reason) {
        activity(this, msg, 'quit,', reason);
      }
    }
  });

  // --- Bot Commands

  var colors = { red: 'red', blue: 'blue', green: 'green' },
      themes = Object.keys(colors).join('|'),
      help = 'Change website theme (' + themes + ')',
      dispatch = bot.dispatcher({
        commands: {
          theme: bot.command(help, function(msg, theme) {
            var probe = colors[theme];
            if (!probe)
              msg.reply('Unrecognized theme "' + theme + '", try: ' + themes);
            else {
              rpc('theme', probe);
              msg.reply('OK');
            }
          })
        }
      });

  function rpc(name) {
    emit({ cmd: name, args: Array.prototype.slice.call(arguments, 1) });
  }

  // --- Activity Formatting

  // Be careful to escape HTML to prevent cross-site scripting
  // attacks.
  var message = statement('message'),
      info = statement('info');

  function activity(client, msg, action, where) {
    if (client.isMine(msg))
      info('<span class="who">You</span> have #{1} #{2}', action, where);
    else
      info('<span class="who">#{1}</span> has #{2} #{3}', msg.nick, action, where);
  }

  function log(statement) {
    sys.log(statement);
    info(statement);
  }

  function statement(cls) {
    return function() {
      var body = escaped.apply(null, arguments);
      rpc('display', now(), '<p class="' + cls + '">' + autolink(body) + '</p>');
    };
  }

  return conn;
}


/// --- Aux

function now() {
  return (new Date()).toUTCString();
}

function escaped(template) {
  var safe = Array.prototype.map.call(arguments, escape_html);
  safe[0] = template;
  return render.apply(null, safe);
}

function render(template) {
  var args = arguments;
  return template.replace(/#{(\d+)}/g, function(m, index) {
    return args[parseInt(index)];
  });
}

function autolink(text) {
  return text.replace(/(\w+:\/\/[a-zA-Z0-9_\-=!\?#\$@~`%&*+\/:;\.,\(\)]+)/g,
                      '<a href="$1">$1</a>');
}

function escape_html(html) {
  return html.replace(/([&<>;"'])/g, function(m, ch) {
    return SPECIAL[ch] || ch;
  });
}

var SPECIAL = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};