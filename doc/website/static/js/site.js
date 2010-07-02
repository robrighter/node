(function($) {

  $(document).ready(function(){
    prettyPrint();
    ui();
    irc();
  });

  function ui() {
    $("ul#documentation li ul").hide();
    $("ul#documentation li").click(function(){
      if ($(this).hasClass('open')){
        $(this).children("ul").slideUp().end().removeClass('open strong').children("strong").html('+');
      }
      else if ($(this).children().length > 1){
        $(this).children("ul").slideDown().end().addClass('open strong').children("strong").html('-');
      }
    });

    if ($("#wrapper").height() < $(window).height()){
      $("#wrapper").css({
        "height" : $(window).height()
      });
    }

    // $('.shadowed').each(function(){
    //   $(this).wrap("<div class='shadow' />");
    // });

    $("a").each(function(){
      var locindex = window.location.href.split('/').length -1;
      var thelocation = window.location.href.split('/')[locindex];
      if ( ($(this).attr('href') != '#') && ($(this).attr('href').substr(1) == thelocation || $(this).attr('href') == thelocation))
             $(this).addClass('active');
    });

    $('#toggleirc').click(function(){
        toggleIrc();
        return false;
    });

    $('.bubble').each(bubble);

    function toggleIrc(){
      var collapse = '1px';
      var expand =  '370px';
      var duration = '1000';
      var moveto = isIrcExpanded() ? collapse : expand;
      $('#irc').animate({ height: moveto, scrollTop: $('#irc .console').attr("scrollHeight") }, duration);
      return false;
    }

  }

  
  /// --- Bubble

  function bubble() {
    var activate = $('.bubble-activate', this),
        wrap = $('.bubble-wrap', this);

    function show() {
      wrap.css('top', -1 * wrap.outerHeight() - 10).fadeIn('fast');
    }

    function hide() {
      wrap.fadeOut('fast');
    }

    activate.toggle(show, hide);

    return this;
  }

  
  /// --- IRC

  var gateway = '/irc-gateway',
      history = 1000,
      pollDelay = 1000;

  /**
   * Initialize the IRC UI.
   */
  function irc() {
    $('#irc .console').each(console);
  }

  /**
   * Continuously long-poll for changes and update the UI accordingly.
   * Each change is in the format:
   *
   *   { offset: NNN, value: ENTRY }
   *
   * where the offset uniquely identies the entry in the timeline.  An
   * entry has this format:
   *
   *   { cmd: 'command-name', args: [arg1, arg2, ...] }
   *
   * See dispatcher() to extend the list of commands.
   */
  function console() {
    var log = $(this).empty(),
        exec = dispatcher(log),
        since = -1;

    function update(data) {
      if (data && data.length > 0) {
        for (var i = data.length - 1; i >= 0; i--)
          exec(data[i].value);
        since = data[0].offset;
      }

      setTimeout(function() { poll(since, update); }, pollDelay);
      truncateHistory(log.children());
    }

    function scroll(delay) {
      return container.animate({ scrollTop: log.attr("scrollHeight") }, 0);
    }

    poll(since, update);
  }

  /**
   * Long-poll for updates since some previous point in time.  When
   * new updates arrive, callback() is passed an array of changes.
   */
  function poll(since, callback) {
    $.ajax({
      type: 'get',
      url: gateway,
      data: { since: since },
      dataType: 'json',
      cache: 'false',
      timeout: 90000,

      success: callback,

      error: function(xhr, status, err) {
        if (status == 'timeout')
          poll(since, callback);
        else
          ircUnavailable();
      }
    });
  }

  /**
   * Keep the length of the history at a reasonable limit.
   */
  function truncateHistory(elems) {
    var size = elems.length;
    if (size > history) {
      elems.slice(0, size - history).remove();
    }
  }

  /**
   * Create a command dispatcher for an IRC log.
   */
  function dispatcher(log) {
    var commands = {
      theme: setTheme,
      display: displayEntry
    };

    return function(entry) {
      var fn = commands[entry.cmd];
      return fn && fn.apply(log, entry.args);
    };
  }

  /**
   * Display activity in the IRC channel with a timestamp.
   */
  function displayEntry(when, body) {
    var entry = formatEntry(when, body),
        delay = isIrcExpanded() ? 200 : 0;

    if (delay)
      entry.hide().appendTo(this).fadeIn('slow');
    else
      entry.appendTo(this);

    this.parent().animate({ scrollTop: this.attr("scrollHeight") }, delay);
  }

  /**
   * Format IRC activity for display.
   */
  function formatEntry(when, body) {
    return $(body)
      .find('a').attr('target', '_blank').end()
      .prepend(time(when, ircTime));
  }

  /**
   * Format a date for display.
   */
  function ircTime(when) {
    return '[' + pad(when.getHours()) + ':' + pad(when.getMinutes()) + ']';
  }

  /**
   * Create an HTML5 <time> element.
   */
  function time(when, display, iso) {
    when = (when instanceof Date) ? when : new Date(when);
    return $('<time/>')
      .attr('datetime', (iso || iso8601UTC)(when))
      .text(display(when));
  }

  /**
   * Convert a date to ISO 8601 standard UTC format.
   */
  function iso8601UTC(when) {
    return (
      when.getUTCFullYear()
      + '-' + pad(when.getUTCMonth())
      + '-' + pad(when.getUTCDate())
      + 'T' + pad(when.getUTCHours())
      + ':' + pad(when.getUTCMinutes())
      + ':' + pad(when.getUTCSeconds())
      + 'Z'
    );
  }

  function pad(n) {
    return (n < 10) ? ('0' + n) : n;
  }

})(jQuery);

/// --- Globals
function setTheme(name){
   $('body').attr('class', name);
}

function ircUnavailable(){
    // $('#toggleirc').parent().fadeOut('slow');
}

function isIrcExpanded(){
    return ($('#irc').css('height') != '1px');
}
