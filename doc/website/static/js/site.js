(function($) {

  $(document).ready(function(){
    prettyPrint();
    ui();
    irc();
  });

  function ui() {
    $('#toc').each(makeTOC);
    adjustHeight();
    activeLinks();
    $('.bubble').each(makeBubble);
  }

  function adjustHeight() {
    var wrap = $('#wrapper'),
        height = $(window).height();

    if (wrap.height() < height)
      wrap.css('height', height);
  }

  function activeLinks() {
    var parts = window.location.href.split('/'),
        here = parts[parts.length - 1];

    $("a").each(function() {
      var href = this.href;
      if ((href != '#') && (href.substr(1) == here || href == here))
        $(this).addClass('active');
    });
  }

  
  /// --- Bubble

  function makeBubble() {
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

  
  /// --- Table of Contents

  function makeTOC() {
    var context = $('<ul/>').appendTo(this),
        depth = 2,
        last = undefined,
        editor = buildEditor(savePatch);

    // Scan for headers, adding a <div class="header" /> before each
    // and generate the navigation in context.
    $('h2, h3').each(entry);

    // Vivify navigation.
    $(this)
      .find('li:first-child').addClass('first').end()
      .find('.more').click(toggle).end()
      .find('.name').click(scrollTo);

    // Vivify headers.
    $('.top').live('click', scrollTop);
    $('.edit').live('click', editSection(editor));

    // Watch for scroll events.
    navUpdater();

    /**
     * For Hn element, create a <div class="header" /> before it and
     * generate a navigation entry.
     */
    function entry(index) {
      var head = $(this),
          id = identify(head, index),
          name = title(head),
          level = parseInt(this.tagName.substr(1, 2));

      // Sometimes several variants of a method are listed in a row.
      // Since the variants all have the same name, skip all but the
      // first.
      if (last && last.children('.name').text() == name)
        return;

      // Add <div class="header" /> and use it as the anchor-point.
      if (last && head.is('h2')) {
        head = header(name).insertBefore(head);
      }

      // Add the unique identifier to anchor this section.
      head.attr('id', id);

      // Generate the navigation entry.  Be sensitive to changes
      // between H2 and H3 to keep the nesting correct.
      var entry = $('<li/>')
        .addClass('level-' + level)
        .append('<a href="#" class="toggle">+</a>')
        .append($('<a class="name"/>').attr('href', '#' + id).text(name));

      if (level > depth) {
        context = $('<ul/>').appendTo(last);
        last.children('.toggle').addClass('more');
      }
      else if (depth > level) {
        context = context.parent().parent();
      }

      context.append(entry);
      last = entry;
      depth = level;
    }

    /**
     * Make a unique identifier for this header.
     */
    function identify(head, index) {
      return head.text()
        .replace(/\(.*\)$/gi, '')
        .replace(/[\s\.]+/gi, '-')
        .replace(/('|"|:)/gi, '')
        .toLowerCase() + '-' + index;
    }

    /**
     * Make a <div class="header" /> for a Hn element.
     */
    function header(name) {
      return $('<div class="header"/>')
        .append($('<div class="title"/>').text(name))
        .append($(
          '<div class="nav">'
          + '<a href="#" class="edit">Edit</a>'
          + '<span class="sep">|</span>'
          + '<a href="#" class="top">Back to Top</a>'
          + '</div>'));
    }

    /**
     * Extract the best name for a Hn element.
     */
    function title(head) {
      return head.text().replace(/\(.*\)$/gi, '');
    }

    /**
     * Show / hide nested navigation elements.
     */
    function toggle(evt) {
      var self = $(this),
          more = self.siblings('ul'),
          links = self.siblings('a').andSelf();

      evt.preventDefault();
      more.slideToggle('fast', function() {
        if (more.is(':visible')) {
          self.text('-');
          links.addClass('expanded');
        }
        else {
          self.text('+');
          links.removeClass('expanded');
        }
      });
    }

    /**
     * Scroll to the link target of an A element.
     */
    function scrollTo(ev) {
      smoothScroll($(this.hash));
    }

    /**
     * Scroll all the way up.
     */
    function scrollTop(ev) {
      smoothScroll(-1);
    }

    /**
     * Scroll smoothly to an element or offset.
     */
    function smoothScroll(elem) {
      $('html').animate({
        scrollTop: (typeof elem == 'number' ? elem : elem.offset().top) + 2
      }, 'fast');
    }

    /**
     * Different browsers use BODY or HTML as the main viewport element.
     */
    function mainView() {
      return ($.browser.webkit) ? $('body') : $('html');
    }

    /**
     * Detect scrolling by polling for changes in the vertical offset
     * of the main viewport element.  When the offset changes, update
     * the section header fixed to the top of the viewport.
     */
    function navUpdater() {
      var headers = $('.header:gt(0)'),
          view = mainView(),
          current = $('#current-section'),
          index = -1,
          last = 0;

      setInterval(function() {
        var top = view.attr('scrollTop');
        if (top != last)
          update(top);
      }, 100);

      function draw(header) {
        if (!header)
          current.empty().data('showing', '').hide();
        else if (current.data('showing') != header.id)
          current.html(header.innerHTML).data('showing', header.id).show();
      }

      function update(top) {
        var idx = Math.max(0, index);
        if (top < $(headers[0]).offset().top)
          index = -1;
        else if (top < last)
          for (idx; idx > 0; idx--) {
            if ($(headers[idx]).offset().top < top) {
              index = idx;
              break;
            }
          }
        else
          for (idx; idx < headers.length; idx++) {
            if ($(headers[idx]).offset().top > top) {
              index = idx - 1;
              break;
            }
          }
        last = top;
        draw(headers[index]);
      }
    }

    /**
     * Create the section editor lightbox.
     */
    function buildEditor(submit) {
      var editor = $('<div id="editor"><div class="overlay"/></div>').appendTo('body'),
          content = $('<div class="content" />').appendTo(editor),
          form = $('<form />').appendTo(content),
          markup = $('<textarea name="markup" class="markup" />').appendTo(form),
          preview = $('<div class="preview" />').appendTo(form),
          patch = $('<div class="patch" />').appendTo(form),
          buttons = $('<div class="buttons" />').appendTo(form),
          close = $('<input type="button" class="button close" value="[x] Cancel" />').appendTo(buttons),
          exports = {};

      submit && form.submit(submit);

      patch
        .append($('<div class="inputs" />')
            .append(labeledInput('name', 'Your Name'))
            .append(labeledInput('email', 'Email'))
            .append('<input type="submit" class="button submit" value="Submit Patch" />'))
        .append('<div class="background" />');


      exports.show = function() {
        editor.height($('body').height()).show();
        content.css('top', parseInt(mainView().attr('scrollTop')) + 50);
        $(document).keyup(keyup);
        return exports;
      };

      close.bind('click', exports.close = function() {
        editor.hide();
        $(document).unbind('keyup', keyup);
        return exports;
      });

      function keyup(ev) {
        if (ev.which == 27)
          exports.close();
      }

      return exports;
    }

    /**
     * Click event handler for "Edit" A elements.
     */
    function editSection(editor) {
      return function(ev) {
        ev.preventDefault();
        editor.show();
      };
    }

    /**
     * Submit handler for editor.
     */
    function savePatch(ev) {
      ev.preventDefault();
    }
  }

  /**
   * Make a text input with its label as the initial value.  On focus,
   * hide the label.
   */
  function labeledInput(name, label) {
    var input = $('<input type="text" class="text" />').addClass(name).attr({
        name: name,
        value: label
      }).focus(function() {
        if (input.val() == label)
          input.val('');
      }).blur(function() {
        if (input.val() == '')
          input.val(label);
      });

    return input;
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
    $('#toggleirc').click(toggleIRC);
  }

  /**
   * Show or hide the IRC console.
   */
  function toggleIRC(ev) {
    var collapse = '1px';
    var expand =  '370px';
    var duration = '1000';
    var moveto = isIrcExpanded() ? collapse : expand;

    ev.preventDefault();
    $('#irc').animate({
        height: moveto,
        scrollTop: $('#irc .console').attr("scrollHeight")
    }, duration);
  }

  /**
   * When someone issues the "theme" command to the webbot, this
   * procedure is called.
   */
  function setTheme(name){
    $('body').attr('class', name);
  }

  /**
   * Called when long-polling fails.
   */
  function ircUnavailable(){
    $('#toggleirc').parent().fadeOut('slow');
  }

  /**
   * Return true if the IRC console is visible.
   */
  function isIrcExpanded(){
    return $('#irc').css('height') != '1px';
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
      cache: false,
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
