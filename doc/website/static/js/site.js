// 
//  jquery.mouse-wheel.min.js
//
(function($){$.event.special.mousewheel={setup:function(){var handler=$.event.special.mousewheel.handler;if($.browser.mozilla){$(this).bind("mousemove.mousewheel",function(event){$.data(this,"mwcursorposdata",{pageX:event.pageX,pageY:event.pageY,clientX:event.clientX,clientY:event.clientY})})}if(this.addEventListener){this.addEventListener(($.browser.mozilla?"DOMMouseScroll":"mousewheel"),handler,false)}else{this.onmousewheel=handler}},teardown:function(){var handler=$.event.special.mousewheel.handler;$(this).unbind("mousemove.mousewheel");if(this.removeEventListener){this.removeEventListener(($.browser.mozilla?"DOMMouseScroll":"mousewheel"),handler,false)}else{this.onmousewheel=function(){}}$.removeData(this,"mwcursorposdata")},handler:function(event){var args=Array.prototype.slice.call(arguments,1);event=$.event.fix(event||window.event);$.extend(event,$.data(this,"mwcursorposdata")||{});var delta=0,returnValue=true;if(event.wheelDelta){delta=event.wheelDelta/120}if(event.detail){delta=-event.detail/3}event.data=event.data||{};event.type="mousewheel";args.unshift(delta);args.unshift(event);return $.event.handle.apply(this,args)}};$.fn.extend({mousewheel:function(fn){return fn?this.bind("mousewheel",fn):this.trigger("mousewheel")},unmousewheel:function(fn){return this.unbind("mousewheel",fn)}})})(jQuery);

// 
//  jScrollPane.min.js
//  
(function(A){A.jScrollPane={active:[]};A.fn.jScrollPane=function(C){C=A.extend({},A.fn.jScrollPane.defaults,C);var B=function(){return false};return this.each(function(){var O=A(this);O.css("overflow","hidden");var X=this;if(A(this).parent().is(".jScrollPaneContainer")){var Ac=C.maintainPosition?O.position().top:0;var L=A(this).parent();var d=L.innerWidth();var Ad=L.outerHeight();var M=Ad;A(">.jScrollPaneTrack, >.jScrollArrowUp, >.jScrollArrowDown",L).remove();O.css({top:0})}else{var Ac=0;this.originalPadding=O.css("paddingTop")+" "+O.css("paddingRight")+" "+O.css("paddingBottom")+" "+O.css("paddingLeft");this.originalSidePaddingTotal=(parseInt(O.css("paddingLeft"))||0)+(parseInt(O.css("paddingRight"))||0);var d=O.innerWidth();var Ad=O.innerHeight();var M=Ad;O.wrap(A("<div></div>").attr({className:"jScrollPaneContainer"}).css({height:Ad+"px",width:d+"px"}));A(document).bind("emchange",function(Ae,Af,p){O.jScrollPane(C)})}if(C.reinitialiseOnImageLoad){var N=A.data(X,"jScrollPaneImagesToLoad")||A("img",O);var G=[];if(N.length){N.each(function(p,Ae){A(this).bind("load",function(){if(A.inArray(p,G)==-1){G.push(Ae);N=A.grep(N,function(Ag,Af){return Ag!=Ae});A.data(X,"jScrollPaneImagesToLoad",N);C.reinitialiseOnImageLoad=false;O.jScrollPane(C)}}).each(function(Af,Ag){if(this.complete||this.complete===undefined){this.src=this.src}})})}}var o=this.originalSidePaddingTotal;var l={height:"auto",width:d-C.scrollbarWidth-C.scrollbarMargin-o+"px"};if(C.scrollbarOnLeft){l.paddingLeft=C.scrollbarMargin+C.scrollbarWidth+"px"}else{l.paddingRight=C.scrollbarMargin+"px"}O.css(l);var m=O.outerHeight();var i=Ad/m;if(i<0.99){var H=O.parent();H.append(A("<div></div>").attr({className:"jScrollPaneTrack"}).css({width:C.scrollbarWidth+"px",height:Ad+"px"}).append(A("<div></div>").attr({className:"jScrollPaneDrag"}).css({width:C.scrollbarWidth+"px"}).append(A("<div></div>").attr({className:"jScrollPaneDragTop"}).css({width:C.scrollbarWidth+"px"}),A("<div></div>").attr({className:"jScrollPaneDragBottom"}).css({width:C.scrollbarWidth+"px"}))));var z=A(">.jScrollPaneTrack",H);var P=A(">.jScrollPaneTrack .jScrollPaneDrag",H);if(C.showArrows){var g;var Ab;var S;var r;var j=function(){if(r>4||r%4==0){y(u+Ab*b)}r++};var K=function(p){A("html").unbind("mouseup",K);g.removeClass("jScrollActiveArrowButton");clearInterval(S)};var Z=function(){A("html").bind("mouseup",K);g.addClass("jScrollActiveArrowButton");r=0;j();S=setInterval(j,100)};H.append(A("<a></a>").attr({href:"javascript:;",className:"jScrollArrowUp"}).css({width:C.scrollbarWidth+"px"}).html("Scroll up").bind("mousedown",function(){g=A(this);Ab=-1;Z();this.blur();return false}).bind("click",B),A("<a></a>").attr({href:"javascript:;",className:"jScrollArrowDown"}).css({width:C.scrollbarWidth+"px"}).html("Scroll down").bind("mousedown",function(){g=A(this);Ab=1;Z();this.blur();return false}).bind("click",B));var Q=A(">.jScrollArrowUp",H);var J=A(">.jScrollArrowDown",H);if(C.arrowSize){M=Ad-C.arrowSize-C.arrowSize;z.css({height:M+"px",top:C.arrowSize+"px"})}else{var s=Q.height();C.arrowSize=s;M=Ad-s-J.height();z.css({height:M+"px",top:s+"px"})}}var w=A(this).css({position:"absolute",overflow:"visible"});var D;var Y;var b;var u=0;var V=i*Ad/2;var a=function(Ae,Ag){var Af=Ag=="X"?"Left":"Top";return Ae["page"+Ag]||(Ae["client"+Ag]+(document.documentElement["scroll"+Af]||document.body["scroll"+Af]))||0};var f=function(){return false};var v=function(){n();D=P.offset(false);D.top-=u;Y=M-P[0].offsetHeight;b=2*C.wheelSpeed*Y/m};var E=function(p){v();V=a(p,"Y")-u-D.top;A("html").bind("mouseup",T).bind("mousemove",h);if(A.browser.msie){A("html").bind("dragstart",f).bind("selectstart",f)}return false};var T=function(){A("html").unbind("mouseup",T).unbind("mousemove",h);V=i*Ad/2;if(A.browser.msie){A("html").unbind("dragstart",f).unbind("selectstart",f)}};var y=function(Ae){Ae=Ae<0?0:(Ae>Y?Y:Ae);u=Ae;P.css({top:Ae+"px"});var Af=Ae/Y;w.css({top:((Ad-m)*Af)+"px"});O.trigger("scroll");if(C.showArrows){Q[Ae==0?"addClass":"removeClass"]("disabled");J[Ae==Y?"addClass":"removeClass"]("disabled")}};var h=function(p){y(a(p,"Y")-D.top-V)};var q=Math.max(Math.min(i*(Ad-C.arrowSize*2),C.dragMaxHeight),C.dragMinHeight);P.css({height:q+"px"}).bind("mousedown",E);var k;var R;var I;var t=function(){if(R>8||R%4==0){y((u-((u-I)/2)))}R++};var Aa=function(){clearInterval(k);A("html").unbind("mouseup",Aa).unbind("mousemove",e)};var e=function(p){I=a(p,"Y")-D.top-V};var U=function(p){v();e(p);R=0;A("html").bind("mouseup",Aa).bind("mousemove",e);k=setInterval(t,100);t()};z.bind("mousedown",U);H.bind("mousewheel",function(Ae,Ag){v();n();var Af=u;y(u-Ag*b);var p=Af!=u;return !p});var F;var W;function c(){var p=(F-u)/C.animateStep;if(p>1||p<-1){y(u+p)}else{y(F);n()}}var n=function(){if(W){clearInterval(W);delete F}};var x=function(Af,p){if(typeof Af=="string"){$e=A(Af,O);if(!$e.length){return}Af=$e.offset().top-O.offset().top}H.scrollTop(0);n();var Ae=-Af/(Ad-m)*Y;if(p||!C.animateTo){y(Ae)}else{F=Ae;W=setInterval(c,C.animateInterval)}};O[0].scrollTo=x;O[0].scrollBy=function(Ae){var p=-parseInt(w.css("top"))||0;x(p+Ae)};v();x(-Ac,true);A("*",this).bind("focus",function(Ah){var Ag=A(this);var Aj=0;while(Ag[0]!=O[0]){Aj+=Ag.position().top;Ag=Ag.offsetParent()}var p=-parseInt(w.css("top"))||0;var Ai=p+Ad;var Af=Aj>p&&Aj<Ai;if(!Af){var Ae=Aj-C.scrollbarMargin;if(Aj>p){Ae+=A(this).height()+15+C.scrollbarMargin-Ad}x(Ae)}});if(location.hash){x(location.hash)}A(document).bind("click",function(Ae){$target=A(Ae.target);if($target.is("a")){var p=$target.attr("href");if(p.substr(0,1)=="#"){x(p)}}});A.jScrollPane.active.push(O[0])}else{O.css({height:Ad+"px",width:d-this.originalSidePaddingTotal+"px",padding:this.originalPadding});O.parent().unbind("mousewheel")}})};A.fn.jScrollPane.defaults={scrollbarWidth:10,scrollbarMargin:5,wheelSpeed:18,showArrows:false,arrowSize:0,animateTo:false,dragMinHeight:1,dragMaxHeight:99999,animateInterval:100,animateStep:3,maintainPosition:true,scrollbarOnLeft:false,reinitialiseOnImageLoad:false};A(window).bind("unload",function(){var C=A.jScrollPane.active;for(var B=0;B<C.length;B++){C[B].scrollTo=C[B].scrollBy=null}})})(jQuery);

// 
//  site.js
//  nodejs.org
//  2010-08-11
// 
(function ($, window, document, undefined) {
  
  // log('inside coolFunc', this, arguments);
  window.log = function () {
    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);
    if(this.console) {
      this.console.log( Array.prototype.slice.call(arguments) );
    }
  };
  
  $(document).ready(function() {
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
      .find('.name').click(expandAndScroll);

    // Vivify headers.
    $('.top').live('click', scrollTop);
    $('.edit').live('click', editSection(editor));

    // Watch for scroll events.
    navUpdater();

    // Watch for browser resizing
    $(window).resize(adjustTocHeight).resize();

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
      evt.preventDefault();
      slideToggle($(this));
      return false;
    }

    function slideToggle(self) {
      var more = self.siblings('ul'),
          links = self.siblings('a').andSelf();

      more.slideToggle('fast', function() {
        if (more.is(':visible')) {
          self.text('-');
          links.addClass('expanded');
        }
        else {
          self.text('+');
          links.removeClass('expanded');
        }
        
        // Check new TOC height against window height and adjust
        adjustTocHeight();
      });
    }

    function expandAndScroll(ev) {
      var self = $(this);

      scrollTo.call(this, ev);
      if (!self.is('.expanded'))
        slideToggle(self.siblings('.more'));
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
      mainView().animate({
        scrollTop: (typeof elem == 'number' ? elem : elem.offset().top) + 1
      }, 'fast');
    }
    
    /**
     * Adjust TOC height on window resize and menu expansions
     */
    function adjustTocHeight() {
      
      var toc = $('#toc');
      
      if ($('div.jScrollPaneContainer').length) {
        toc.unwrap('div.jScrollPaneContainer').removeAttr('style');
        $('div.jScrollPaneTrack').remove();
      }
      
      var manHeight = $('#man-sidebar').height(),
          wh = $(window).height();
          
      // Apply jScrollPane if needed
      if ( manHeight > wh && $('#man-sidebar').hasClass('fixed-sidebar')) {
        toc.height(wh - 127); // account for Print Documentation button and footer height
      
        // Apply Scroll Pane
        $('#toc').jScrollPane({
          scrollbarWidth: 3,
          wheelSpeed: 1,
          dragMaxHeight: 50,
          showArrows: false
        });
      }
      
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
          sidebar = $('#man-sidebar'),
          sidebarDefault = sidebar.offset().top - 16,
          view = mainView(),
          current = $('#current-section'),
          index = -1,
          last = 0;
      
      $(window).scroll(function() {
        var top = view.attr('scrollTop');
        if (top != last) {
          updateHeader(top);
          updateSidebar(top);
          last = top;
        }
      });

      function draw(header) {
        if (!header)
          current.empty().data('showing', '').hide();
        else if (current.data('showing') != header.id)
          current.html(header.innerHTML).data('showing', header.id).show();
      }

      function updateHeader(top) {
        var idx = Math.max(0, index);
        if (top < $(headers[0]).offset().top)
          index = -1;
        else if (top < last)
          for (idx; idx > 0; idx--) {
            if ($(headers[idx]).offset().top <= top) {
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
        draw(headers[index]);
      }
      
      function updateSidebar(top) {
        if (top > sidebarDefault)
          sidebar.addClass('fixed-sidebar');
        else {
          sidebar.removeClass('fixed-sidebar');
          
          // Remove scrollbar simply by calling the check
          adjustTocHeight();
        }
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
      return false;
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
    var height;

    ev.preventDefault();
    if (isIrcExpanded()) {
      height = '1px';
      this.innerText = 'Read  the IRC Channel';
    }
    else {
      height = '370px';
      this.innerText = 'Hide the IRC Channel';
    }

    $('#irc').animate({
        height: height,
        scrollTop: $('#irc .console').attr("scrollHeight")
    }, 1000);
    
    return false;
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
  
})(jQuery, this, document);

/// --- Globals